# IDE V2 Target Architecture

## Package Topology

Proposed monorepo packages (simplified):

1. `@zstudio/ide-core` — runtime (kernel + domain + platform)
2. `reactui` — React renderer (existing package, evolves into thin adapter)

Additional renderers (Vue, Svelte) are deferred until needed.

## Layer Responsibilities

### `@zstudio/ide-core`

Single runtime package containing kernel, domain, and platform concerns:

**Kernel (core runtime):**

- `WorkbenchService` (areas, tabs, dock model, active widget)
- `DocumentService` (URI documents, dirty, save, restore)
- `CommandService` (register/execute)
- `ContextKeyService` (focus/selection/conditions)
- `SessionService` (layout/session persistence orchestration)
- `EventBus` (typed events)

**Domain (editor modules):**

- SceneTree module
- Inspector module
- Viewport module
- Asset Browser module

Each module contributes runtime behavior via contracts.

**Platform (environment adapters):**

- `StoragePort` implementation (Electron/local/web)
- `FileSystemPort`
- `IpcPort`
- `KeymapPort`
- `TelemetryPort`

Core depends on ports, never concrete Electron APIs.

No UI framework imports.

### `reactui` (React renderer)

Existing package that evolves into the thin React adapter:

- subscribe to runtime selectors
- map widget descriptors to React components
- dispatch runtime intents on user interaction

Renderers are intentionally thin. `reactui` can be renamed to `@zstudio/ide-renderer-react` later if desired.

## Core Contracts (Framework-agnostic)

```ts
export interface RuntimeIntent {
  type: string;
  payload?: unknown;
}

export interface RuntimeEffect {
  type: string;
  payload?: unknown;
}

export interface RuntimeStore<S> {
  getState(): S;
  dispatch(intent: RuntimeIntent): RuntimeEffect[];
  subscribe(listener: () => void): () => void;
}
```

```ts
export interface WidgetContribution {
  id: string;
  title: string;
  defaultArea: "left" | "right" | "bottom" | "center";
  closable: boolean;
  createController(ctx: WidgetRuntimeContext): WidgetController;
}

export interface WidgetController {
  onMount?(): void;
  onActivate?(): void;
  onDeactivate?(): void;
  onDispose?(): void;
  serializeState(): unknown;
  restoreState(raw: unknown): void;
  getViewModel(): unknown;
  handleIntent(intent: RuntimeIntent): RuntimeEffect[];
}
```

## Key Rule: No ReactNode in Runtime

Runtime outputs serializable view model data only.
Icons/components are resolved by each renderer adapter.

## Data Direction

1. Runtime state -> selector -> view model
2. Renderer view interaction -> runtime intent
3. Runtime intent -> state update + effects
4. Platform executes effects and can dispatch follow-up intents

This creates deterministic behavior and portable tests.

