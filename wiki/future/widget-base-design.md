# Widget Base Design (Future)

## Purpose

This document proposes a **minimal `Widget` contract** that fits the current Zernikalos Studio React/Electron UI and enables an incremental migration toward a persistent Workbench.

The goal is to eliminate destructive navigation and UI state loss by making **each UI unit self-contained**, with stable identity, lifecycle, and persistence—without introducing an external plugin system or heavy DI.

## 1) What is a “Widget” in this editor?

A **Widget** is a UI unit that the Workbench can:

- Mount into an **area**: `left` / `right` / `bottom` / `center`
- Display as a **tab**
- **Activate / deactivate** (focus routing)
- **Persist** (widget state + layout participation)
- **Close / reopen**

A Widget should **not**:

- Know docking/layout implementation details
- Persist its UI state in global application stores
- Perform IO directly (filesystem/IPC). That belongs to services provided via context

## 2) Minimal Widget contract (essential)

The Widget base contract has three sections:

### 2.1 Metadata

- `id: string` — stable identifier (primary key for persistence)
- `title: string`
- `icon?: string` — optional (or a small descriptor; keep it simple)
- `closable?: boolean` — defaults depend on UX (e.g., Console closable, Viewport not)

### 2.2 Lifecycle

- `onMount?(): void` — called once when created for the first time
- `onActivate?(): void` — called when it becomes the active tab / receives focus
- `onDeactivate?(): void` — called when it loses focus
- `onDispose?(): void` — called when it is closed and removed

### 2.3 Persistence (the “no more state loss” part)

- `serializeState(): JsonValue`
- `restoreState(state: JsonValue): void`

That is sufficient to preserve:

- Tree expansion / filtering (Scene Tree)
- Inspector active section/tab
- Viewport camera, grid toggles, framing preferences, etc.

> Note: This “UI persistence” is **not** the same as document `dirty` state. Widgets persist UI affordances; documents persist user content.

## 3) Render contract (how React mounts it)

Two viable patterns:

### Style A (recommended): Headless Widget + `render()`

The widget owns identity + lifecycle and exposes:

- `render(): ReactNode`
- optionally a small internal model/store accessor (avoid over-engineering)

The Workbench:

- Creates the widget instance
- Calls `render()` to mount it in a tab/area
- Owns activation routing and persistence scheduling

**Pros**
- Keeps Widget identity and lifecycle explicit
- Fits incremental migration: existing components can be wrapped without refactors
- Avoids inventing a plugin framework

### Style B: Widget provides a React component

The widget exposes:

- `component: React.FC<{ widgetId: string }>`

**Pros**
- Very idiomatic React

**Cons**
- Widgets can degrade into “metadata only”
- Lifecycle becomes unclear unless reintroduced elsewhere

**Recommendation**: Start with **Style A**. You can still render React components inside `render()`.

## 4) Minimal WidgetContext (decoupling without DI)

Widgets should not import app subsystems directly. They should receive a **minimal context** on creation:

Conceptually:

- `commands` — execute/register where appropriate
- `contextKeys` — set focus/selection context used for enabling commands
- `storage` — persistent key/value access
- `events` — event bus (optional but useful)
- `workbench` — open/close widgets and documents

This prevents circular dependencies and keeps features Lego-like.

## 5) Persistence keys and schema versioning

Each widget persists independently.

### Storage key

Use a stable key convention:

- `widgetState:${id}`

### Schema versioning

Always store a state version. You will change shapes.

Example:

```json
{
  "v": 1,
  "data": {
    "expanded": ["file:///a", "file:///b"],
    "selected": "file:///a/readme.md"
  }
}
```

Rules:

- `serializeState()` should return `{ v, data }`
- `restoreState()` should handle unknown/missing versions safely (fallback to defaults)
- If needed later: add `migrateState(fromVersion, raw)` in the base class

## 6) What the Workbench assumes about a Widget (minimum)

The Workbench only needs to:

- Create a widget (via factory)
- Mount it (via `render()`)
- Call lifecycle on activation/deactivation
- Ask for state to persist (`serializeState()`)
- Pass state when restoring (`restoreState()`)
- Dispose when closing (`onDispose()`)

The Workbench must **not** know widget internal state shape.

## 7) A concrete `BaseWidget` (abstract class) to reduce boilerplate

An abstract base class is valuable if it only contains **obvious shared plumbing**:

- Common metadata: `id`, `title`, `closable`, optional `icon`
- Lifecycle flags: `isMounted`, `isActive`
- Persistence helpers:
  - `loadState()` / `saveState()`
  - `schedulePersist()` (debounced)
- Context key integration helpers (focus keys)

### Conceptual interface (TypeScript)

```typescript
type JsonValue =
    | null
    | boolean
    | number
    | string
    | JsonValue[]
    | { [key: string]: JsonValue };

export type WorkbenchArea = 'left' | 'right' | 'bottom' | 'center';

export interface WidgetContext {
    commands: {
        executeCommand: (id: string, args?: unknown) => void | Promise<void>;
    };
    contextKeys: {
        set: (key: string, value: JsonValue) => void;
        get: (key: string) => JsonValue;
    };
    storage: {
        getJson: (key: string) => Promise<JsonValue | undefined>;
        setJson: (key: string, value: JsonValue) => Promise<void>;
    };
    workbench: {
        openWidget: (id: string, area?: WorkbenchArea) => void;
        closeWidget: (id: string) => void;
    };
    events?: {
        emit: (type: string, payload?: unknown) => void;
        on: (type: string, handler: (payload?: unknown) => void) => () => void;
    };
}

export interface Widget {
    id: string;
    title: string;
    icon?: string;
    closable?: boolean;

    onMount?(): void;
    onActivate?(): void;
    onDeactivate?(): void;
    onDispose?(): void;

    serializeState(): JsonValue;
    restoreState(state: JsonValue): void;

    render(): React.ReactNode;
}

export abstract class BaseWidget implements Widget {
    public readonly id: string;
    public readonly title: string;
    public readonly icon?: string;
    public readonly closable?: boolean;

    protected readonly ctx: WidgetContext;

    protected isMounted = false;
    protected isActive = false;

    private persistTimer: number | null = null;

    protected constructor(ctx: WidgetContext, options: {
        id: string;
        title: string;
        icon?: string;
        closable?: boolean;
    }) {
        this.ctx = ctx;
        this.id = options.id;
        this.title = options.title;
        this.icon = options.icon;
        this.closable = options.closable;
    }

    public mount(): void {
        if (this.isMounted) return;
        this.isMounted = true;
        this.onMount?.();
    }

    public activate(): void {
        if (!this.isMounted) this.mount();
        if (this.isActive) return;
        this.isActive = true;
        this.onActivate?.();
    }

    public deactivate(): void {
        if (!this.isActive) return;
        this.isActive = false;
        this.onDeactivate?.();
    }

    public dispose(): void {
        this.clearPersistTimer();
        this.onDispose?.();
    }

    protected getStateStorageKey(): string {
        return `widgetState:${this.id}`;
    }

    public async loadState(): Promise<void> {
        const raw = await this.ctx.storage.getJson(this.getStateStorageKey());
        if (raw !== undefined) {
            this.restoreState(raw);
        }
    }

    public schedulePersist(delayMs = 250): void {
        this.clearPersistTimer();
        this.persistTimer = window.setTimeout(() => {
            void this.saveState();
        }, delayMs);
    }

    public async saveState(): Promise<void> {
        await this.ctx.storage.setJson(this.getStateStorageKey(), this.serializeState());
    }

    protected markDirtyUI(): void {
        // Not document dirty. Signals UI state changed and should be persisted soon.
        this.schedulePersist();
    }

    private clearPersistTimer(): void {
        if (this.persistTimer !== null) {
            window.clearTimeout(this.persistTimer);
            this.persistTimer = null;
        }
    }

    public abstract serializeState(): JsonValue;
    public abstract restoreState(state: JsonValue): void;
    public abstract render(): React.ReactNode;
}
```

Notes:

- The base class above is **conceptual**: keep it small and evolve as you migrate widgets.
- `mount()/activate()/deactivate()/dispose()` are intentionally explicit to keep lifecycle deterministic.
- `loadState()` can be called by the Workbench on first mount (or during session restore).

## 8) Practical extras worth adding on day 1

### A) Debounced persistence

Persisting on every click will thrash storage and degrade performance. Provide:

- `schedulePersist()` with debounce
- optionally persist on `deactivate()` or on Workbench “flush”

### B) “State changed” signal

Expose a light mechanism to inform “persist soon”:

- `markDirtyUI()`

This avoids coupling widgets to Workbench internals.

### C) Focus routing helpers (optional)

Not required initially, but very useful later:

- `focus(): void` or `getDefaultFocusElement(): HTMLElement | null`

Enables Workbench-level shortcuts like “Ctrl+1 focus left area”.

## 9) Minimal example: `ConsoleWidget`

Concept:

- `id = "console"`
- `title = "Console"`
- `serializeState()` stores log filter + level
- `restoreState()` applies them
- `onActivate()` sets context key `consoleFocus = true`
- `onDeactivate()` sets it to false
- `render()` renders the log list

No router, no global stores, no IO.

## 10) One-sentence summary

A Widget base is **stable identity + lifecycle + render + local persistence**, and everything else lives outside.

## Fit with the current codebase (incremental migration)

This model fits the current editor because:

- The UI already benefits from keep-alive patterns (e.g., KeepAliveRouter). Widgets formalize that persistence per unit.
- Existing panels (TreeView, Inspector, Viewer) can be wrapped as widgets without changing their internals at first.
- Services (Electron IPC, filesystem, project APIs) can be injected through `WidgetContext` to avoid circular dependencies.
- Global stores remain focused on cross-cutting state; widget UI state moves local.

Suggested migration order:

1. Wrap the left TreeView panel into a `SceneTreeWidget`
2. Wrap an Inspector panel
3. Wrap the Viewport (canvas managed outside React render cycle)
4. Introduce Workbench areas/tabs progressively as wrappers around the current layout


