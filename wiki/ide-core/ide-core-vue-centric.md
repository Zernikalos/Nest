# Proposal: IDE Core Vue-Centric Bridge

## Status

**Implemented** — See `EditorRuntime`, `@ide-core/vue` (`useEditorStore`), `EditorOrchestrator`, and `src/core/editor/*`. Historical sections below mention `useEditorHost` / `DocumentModule`; the current bridge is Pinia + `getSlice` / `subscribeSlice`.

## Summary

Nest Studio’s editor mechanics (scene tree, documents, workbench, project, engine, commands) belong in **`ide-core`**, expressed as **object-oriented services** with explicit methods and invariants.

**`vueui` paints and colors**: it renders snapshots, forwards user gestures as calls into the runtime, and hosts platform adapters (Electron, router, dialogs). It must not own canonical editor state or duplicate orchestration that already exists in the core.

Between both worlds we introduce a **thin, easy-to-orchestrate bridge**: one host API, one change channel, one snapshot for the UI tree.

---

## Goals

| Goal | Description |
|------|-------------|
| **Single source of truth** | All editor transitions are decided in `ide-core`, not in Pinia/refs/computed. |
| **OOP-first domain** | Behavior lives in services and controllers (`open`, `close`, `select`, `execute`), not in reducer `switch` + coordinator `if` chains scattered across layers. |
| **Simple Vue integration** | One subscription, one snapshot refresh pattern; no “reactivity fights” across three manual `subscribe` blocks. |
| **Testable mechanics** | Domain tests call service methods and assert snapshots/events without mounting Vue. |
| **Keep ports** | Storage, project, engine, and conversion stay behind interfaces; Electron/web adapters stay in `vueui` / `electronapp`. |

## Non-Goals

- Replacing Vue with another renderer (React remains out of scope for this proposal).
- Moving **UI-only** state into `ide-core` (dialog open flags, theme, router, form layout).
- Mandating a heavy DI framework in the first iteration (manual constructor wiring in a composition root is acceptable).
- Deleting the current runtime in one step (migration is incremental).

---

## Problem (pre-refactor, resolved)

The separation on paper was correct ([Integration boundaries](../vueui/integration-boundaries.md)), but the **adapter layer was thicker than intended** before `EditorRuntime` + `useEditorHost()`:


```text
┌──────────── vueui ────────────┐
│ useIdeCore (removed): mirrors │  ← replaced by useEditorHost
│ useProject: ref + subscribe   │  ← mirrors project
│ NestEditorProvider: more subs │  ← mirrors conversion
└──────────────┬────────────────┘
               │ intents + getViewModel()
┌──────────────▼────────────────┐
│ ide-core: stores + coordinators│
└───────────────────────────────┘
```

Symptoms:

1. **Duplicated read models** — Vue holds `ref` copies of `getViewModel()` and must remember to refresh related slices (e.g. documents change → refresh scene).
2. **Split orchestration** — Rules live in reducers (`DocumentModule`), coordinators (`SceneDocumentCoordinator`), and composables (`handleTabChange` / `nodeIdToDocumentUri`).
3. **Intent strings** — Easy to dispatch from the wrong layer; payloads are loosely typed (`RuntimeIntent.payload?: unknown`).
4. **Hard to answer “what happens when…”** — Flow crosses 3–4 files instead of one service method.

The vue-centric proposal does **not** mean “put everything in Pinia”. It means **one imperative core** and **one reactive mirror** at the UI boundary.

---

## Target Architecture

```text
                    User input (click, menu, IPC)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ vueui — presentation only                                    │
│  • Components bind to EditorSnapshot (readonly DTO)          │
│  • @click → editor.documents.openZObject(id)                 │
│  • useEditorHost() — single bridge composable                │
│  • Pinia only for UI chrome (dialogs, settings, theme)       │
└─────────────────────────────┬───────────────────────────────┘
                              │ method calls ↓    ↑ change events
┌─────────────────────────────▼───────────────────────────────┐
│ ide-core — EditorRuntime (facade)                              │
│  • scene: SceneTreeEditor                                      │
│  • documents: DocumentsEditor        ← canonical tabs        │
│  • workbench: WorkbenchEditor (+ widget lifecycle)             │
│  • project: ProjectEditor                                      │
│  • engine: EngineEditor                                        │
│  • assets: AssetConversionEditor                               │
│  • commands: CommandService                                    │
│  • session: SessionCoordinator + SessionService                │
└─────────────────────────────┬───────────────────────────────┘
                              │ ports
┌─────────────────────────────▼───────────────────────────────┐
│ Adapters (vueui/runtime/*, electron)                           │
└───────────────────────────────────────────────────────────────┘
```

### Principle: Vue paints, core decides

| Layer | Owns | Does not own |
|-------|------|----------------|
| **ide-core** | What is open, active, dirty, selected, loading, engine status | DOM, CSS, Vue components, router |
| **vueui** | How it looks, layout, animations, local form state | Whether a tab exists, sync scene↔documents |

---

## Domain Model (OOP Center)

Reducers and intent constants remain valid during migration, but the **target shape** is service classes with private state (optionally updated via Immer internally).

### Example responsibilities

| Service | Public API (illustrative) |
|---------|---------------------------|
| `DocumentsEditor` | `open(uri, opts?)`, `close(uri)`, `setActive(uri)`, `setDirty(uri, bool)`, `openZObject(nodeId)` |
| `SceneTreeEditor` | `setTreeFromRoot(root)`, `selectNodes(ids)`, `toggleExpanded(id)` |
| `EditorOrchestrator` | Coordinates cross-cutting rules, e.g. `selectNodes` → open `zobject://` document; `setActiveDocument` → update selection — **one place** |
| `ProjectService` | `open(path)`, `close()`, `create(name, path)`, `addAsset(asset)` |
| `CommandRegistry` | `register(command)`, `execute(id, payload?)`, `canExecute(id)` |
| `WidgetLifecycleManager` | Unchanged idea: `WidgetController` per panel |

### Commands as objects (optional evolution)

```ts
interface EditorCommand {
  readonly id: string;
  canExecute(ctx: CommandContext): boolean;
  execute(ctx: CommandContext): void | Promise<void>;
}
```

Menus, palette, and Electron IPC register the same ids; implementation stays in `ide-core`.

### Widget controllers

Keep and extend `WidgetContribution` / `WidgetController`: panel logic stays OOP; Vue maps `widgetId` → component.

### Two-layer bridge (implemented)

Communication between `ide-core` and `vueui` uses **two layers**:

| Layer | Mechanism | Responsibility |
|-------|-----------|----------------|
| **Global** | `EditorRuntime.getSnapshot()` + `onChange()` + `useEditorHost()` | Shell state: scene, documents, workbench, project, engine, assets |
| **Per panel** | `WidgetContribution` / `WidgetController` + `widgetRegistry` | Panel OOP logic; Vue maps `widgetId` → SFC |

`SceneTreeWidgetController` and `createSceneTreeWidgetContribution()` wire the scene tree as a real workbench widget. `WorkbenchWidgetHost.vue` renders widgets from `snapshot.workbench.areas`.

---

## Bridge: Communication Between Core and Vue

The bridge is a **small, stable contract** so `vueui` never improvises subscriptions per domain.

### 1. `EditorApplication` (facade)

Single entry point created by `createEditorApplication(ports)` (evolves from `createEditorRuntime`).

```ts
interface EditorApplication {
  readonly scene: SceneTreeEditor;
  readonly documents: DocumentsEditor;
  readonly workbench: WorkbenchEditor;
  readonly project: ProjectEditor;
  readonly engine: EngineEditor;
  readonly assetConversion: AssetConversionEditor;
  readonly commands: CommandRegistry;
  readonly session: SessionPersistenceService;

  /** Immutable DTO for the whole UI tree — safe to pass to Vue templates */
  getSnapshot(): EditorSnapshot;

  /** Subscribe to any domain change that affects the snapshot */
  onChange(listener: () => void): () => void;

  /** Optional: fine-grained topics if profiling shows full snapshot is too heavy */
  on(event: EditorChangeTopic, listener: () => void): () => void;
}
```

### 2. `EditorSnapshot` (read model)

One plain object, JSON-serializable, no methods:

```ts
interface EditorSnapshot {
  scene: SceneTreeViewModel;
  documents: DocumentViewModel;
  workbench: WorkbenchViewModel;
  project: ProjectViewModel;
  engine: EngineSessionViewModel;
  assets: AssetConversionViewModel;
}
```

Vue components use **only** `snapshot` (or slices derived in composables with `computed`, as long as they do not mutate domain).

### 3. Change notification

**Default (simple):** any mutating call on services ends with `notifyChange()` → all `onChange` listeners run → Vue refreshes `snapshot` once.

**Optional (scalability):** typed topics:

```ts
type EditorChangeTopic =
  | 'scene'
  | 'documents'
  | 'workbench'
  | 'project'
  | 'engine'
  | 'assets'
  | 'all';
```

Start with `'all'` only; split topics when profiling requires it.

Implementation options (pick one in code, all stay inside `ide-core`):

| Mechanism | Pros |
|-----------|------|
| `EventEmitter` / `eventemitter3` | Simple, familiar, easy to test |
| Callback set on facade | Zero dependency |
| RxJS `Subject` | Debounce, compose — only at the boundary, not in domain methods |

**Rule:** domain services do not import Vue or expose Observables to `vueui` unless we standardize on one adapter type.

### 4. `useEditorHost()` (vueui composable)

Single composable replaces the multi-subscribe pattern in `useIdeCore` / parts of `useProject`:

```ts
// vueui — conceptual
export function useEditorHost() {
  const app = inject<EditorApplication>(EDITOR_APP_KEY);
  if (!app) throw new Error('useEditorHost requires EditorHostProvider');

  const snapshot = shallowRef(app.getSnapshot());

  onMounted(() => {
    return app.onChange(() => {
      snapshot.value = app.getSnapshot();
    });
  });

  return { app, snapshot };
}
```

Component usage:

```vue
<script setup>
const { app, snapshot } = useEditorHost();
</script>

<template>
  <SceneTree
    :tree="snapshot.scene.tree"
    @select="(ids) => app.scene.selectNodes(ids)"
  />
</template>
```

No business logic in the template beyond forwarding to `app.*`.

### 5. `EditorHostProvider` (vueui)

Replaces the growing responsibilities of `IdeCoreProvider`:

- Builds ports (storage, project, engine, conversion).
- Calls `createEditorApplication(ports)`.
- `provide(EDITOR_APP_KEY, app)`.
- Optionally wires **host reactions** (navigate, native menu) listening to core events or command effects — not mixed into scene/document services.

---

## What Stays in vueui

| Concern | Where |
|---------|--------|
| Visual design, Tailwind, Radix, Monaco | Components |
| Router pages (`/projects`, `/editor`) | vue-router |
| `projectUIStore` — create dialog, creating flag | Pinia (UI only) |
| `settingsStore`, `appearanceStore` | Pinia |
| Electron `window.NativeZernikalos` | Host port implementations |
| Mapping `widgetId` → Vue SFC | Registry in vueui |

---

## Migration Roadmap

### Phase 0 — Document and bridge skeleton (no behavior change)

- Add `getSnapshot()` + `onChange()` on top of current `EditorRuntimeImpl` (aggregates existing view models).
- Introduce `useEditorHost()` alongside `useIdeCore`; migrate one screen (e.g. `SceneTree`) to prove the pattern.

### Phase 1 — Unify tabs (high value)

- Merge scene↔document sync into one orchestrator/service.
- Remove duplicate `activeNode` vs `activeUri` mental model from docs and code paths.
- See also [review-vueui-ide-core-separation](../proposals/v2/review-vueui-ide-core-separation.md) § document view model.

### Phase 2 — Extract services

- Wrap each domain module store behind a service class with methods.
- Keep reducers internal or replace with private Immer updates.
- Deprecate public intent constants for adapters (keep for tests/plugins if needed).

### Phase 3 — Thin vueui

- Remove per-domain `ref` + `subscribe` from composables.
- Route all editor interactions through `app.*` methods.
- Pinia only for non-editor UI state.

### Phase 4 — Optional polish

- Command objects with `canExecute`.
- Topic-based `on('documents', …)` if snapshot refresh is too coarse.
- Align with [V3 DI/contributions](../proposals/v3/architecture-improvements.md) if a container is adopted later.

---

## Relationship to Existing Docs

| Document | Relationship |
|----------|----------------|
| [Architecture](./architecture.md) | Still valid for ports and module split; this proposal refines **how UI binds**, not **what domains exist**. |
| [Runtime API](./runtime-api.md) | Will gain `getSnapshot` / service methods; intents become implementation detail. |
| [vueui integration boundaries](../vueui/integration-boundaries.md) | Reinforced: vueui thinner, not thicker. |
| [V3 architecture improvements](../proposals/v3/architecture-improvements.md) | Complementary: DI/contributions can sit **inside** `ide-core` while Vue keeps the bridge above. |

---

## Success Criteria

1. A developer can trace “user closes tab” to **one** method (`documents.close`) and optional orchestrator hooks without opening Vue files.
2. `vueui` has **one** editor subscription pattern (`useEditorHost`), not N copies.
3. No editor rule in `computed()` or Pinia actions except UI chrome.
4. Unit tests cover services without `mount()`; component tests mock `EditorApplication` or snapshot fixtures.
5. Session restore goes through services; snapshot after `hydrate()` matches persisted intent.

---

## Open Questions

1. **Naming:** `EditorApplication` vs `EditorHost` vs keep `EditorRuntime` as alias during migration?
2. **Granularity of snapshot:** always full tree vs incremental patches for large scenes?
3. **Async errors:** surface via snapshot (`project.error`) only, or also `onError` events for toasts?
4. **Router vs documents:** should navigation to `/editor` be a command side-effect from `ProjectService.open`, or remain a vueui host listener?

---

## Decision Log (to fill when adopted)

| Date | Decision |
|------|----------|
| 2026-05 | Keep `EditorRuntime` naming; add `getSnapshot`/`onChange` and domain services |
| 2026-05 | Two-layer bridge: global snapshot + per-widget controllers |
