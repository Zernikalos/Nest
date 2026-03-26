# IDE V2 Disruptive Migration Roadmap

## Strategy

This plan is intentionally disruptive:

- freeze non-critical editor features during core extraction
- move one vertical at a time into runtime
- keep a temporary React adapter only as a bridge

## Phases

## Phase 0 - Alignment and Freeze (1-2 weeks)

Deliverables:

- approve V2 architecture docs
- define package boundaries
- freeze editor feature work not related to migration
- create architecture guardrails (lint rules for forbidden imports)

Exit criteria:

- team agrees on non-negotiables
- CI fails if runtime imports UI frameworks

## Phase 1 - Core Bootstrap (2-3 weeks)

Deliverables:

- create `@zstudio/ide-core` (kernel + domain + platform)
- implement runtime store, intent/effect model
- implement `CommandService`, `ContextKeyService`, `EventBus`
- implement `StoragePort` abstraction

Exit criteria:

- core unit tests run without DOM/Electron

## Phase 2 - First Vertical Slice (3-4 weeks)

Scope:

- Scene Tree + Selection + Tabs + Active Document

Deliverables:

- move current editor behavior from React hooks to runtime controllers
- React UI reads view models and dispatches intents only

Exit criteria:

- no canonical tree/selection/tab logic remains in React hooks
- vertical works end-to-end in app

## Phase 3 - Workbench and Session (2-3 weeks)

Deliverables:

- runtime layout model (areas + widget placement)
- widget lifecycle routing in kernel
- session and layout persistence in kernel

Exit criteria:

- layout and open docs restore from runtime session data

## Phase 4 - Command Unification (2 weeks)

Deliverables:

- all editor commands registered in kernel
- Electron menu/shortcuts mapped to runtime commands through platform adapter

Exit criteria:

- command enablement driven only by runtime context keys

## Phase 5 - Secondary Renderer Proof (deferred)

Deliverables (when needed):

- implement small Vue or Svelte adapter
- render at least one real widget from same runtime

Exit criteria:

- same runtime package used by React and second adapter without forks

For V2, only the React renderer (`reactui`) is in scope.

### Phase 5 Vue adapter (prepared)

A Vue 3 adapter application (`vueui`) has been added to prove the same runtime can drive a second renderer:

- **Runtime**: Uses the root-level `ide-core` runtime through the `@ide-core` alias. `createEditorRuntime` lives in `ide-core`; both `reactui` and `vueui` call it with their own `StoragePort` (e.g. localStorage).
- **Vue package**: `vueui` provides:
  - `IdeCoreProvider.vue`: provides the runtime via `provide/inject`.
  - `useIdeCore()` composable: subscribes to scene tree and workbench view models, exposes `dispatchSceneTree`, `executeCommand`, `contextKey`, etc.
  - **Scene Tree widget**: `SceneTree.vue` + `SceneTreeNode.vue` render the tree from `getSceneTreeViewModel()`, dispatch `SELECT_NODES` and `OPEN_TAB` on click. No fork of ide-core; same contracts.
- **Run**: From repo root, `pnpm run dev:ui`. `vueui` now lives at repository root and is the primary renderer for the monolithic application flow.

## Risks and Controls

1. Risk: migration fatigue
   Control: strict phase gates and temporary feature freeze

2. Risk: partial migration creates dual truth
   Control: each vertical completes fully before next starts

3. Risk: adapter creep
   Control: renderer packages forbidden from owning editor behavior

## Kill Criteria

Pause the migration if:

- runtime and UI duplicate the same behavior for more than one phase
- new editor features bypass runtime contracts
- no measurable reduction in framework coupling after Phase 2
