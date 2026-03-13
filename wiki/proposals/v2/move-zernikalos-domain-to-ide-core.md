# Proposal: Move Zernikalos Editor Domain into `ide-core`

## Status

Draft proposal for V2 architecture direction.

## Problem Statement

The current Studio architecture still places too much editor-specific orchestration in the UI layer.

Examples of this pressure include:

- asset management flows
- conversion of generic 3D assets into the `zko` format
- project-level scene editing workflows
- engine lifecycle handling for preview, debugging, or live editing
- coordination between host capabilities and editor state

These concerns are not visual concerns. They are part of the IDE domain for editing Zernikalos scenes.

When they live primarily in `vueui`, the renderer becomes responsible for more than rendering:

- domain rules spread into composables and stores
- host integration and editor orchestration become intertwined
- it becomes harder to swap the renderer or add another one
- tests require more UI scaffolding than necessary
- the runtime stops being the true source of editor behavior

## Proposal

Move the Zernikalos editor domain into `@zstudio/ide-core`, while keeping concrete infrastructure and platform execution outside the core.

This means:

- `ide-core` owns editor use cases, state transitions, and contracts
- the renderer owns visual composition and user interaction
- the host owns Electron, filesystem, process management, IPC, and backend wiring

The goal is not to put everything into one package.
The goal is to put the right kind of logic in the runtime.

## What Should Move to `ide-core`

The following responsibilities are strong candidates for the runtime:

### 1. Asset Domain Workflows

- asset import orchestration
- asset validation rules
- conversion requests from external formats to `zko`
- asset status and progress state
- relationships between imported assets and scene/editor state

### 2. Scene Editing Domain

- scene object lifecycle
- editor-facing operations on ZObjects
- synchronization between selected nodes, opened documents, and active editor targets
- domain commands for scene editing

### 3. Project and Workspace Concepts

- current workspace/project identity
- project-open / project-closed state
- domain effects caused by opening, closing, or switching projects
- session rules that depend on project context

### 4. Engine Session Domain

- start engine session
- stop engine session
- restart engine session
- track session state such as idle, starting, running, stopping, failed
- represent preview/debug/live-edit capabilities as runtime concepts

### 5. Editor Use Cases

- bundle scene
- prepare runtime data for preview
- respond to asset conversion completion
- coordinate command execution with project and engine state

## What Should Not Move to `ide-core`

The following concerns should remain outside the core:

- Vue components, composables tied to rendering, and router navigation
- direct Electron APIs
- direct Nest server bootstrapping
- process spawning and operating-system interaction
- direct filesystem implementation details
- HTTP clients and transport details
- renderer-only notifications, dialogs, and visual shell state

In short:

- domain belongs in the core
- implementation details belong in adapters

## Proposed Boundary Model

```text
User action
   ↓
Renderer adapter (`vueui` / `reactui`)
   ↓
Runtime command or intent (`ide-core`)
   ↓
Runtime updates state and emits effects
   ↓
Host adapter executes effect via Electron / IPC / process / file system
   ↓
Host dispatches result back into runtime
```

## Ports and Contracts Needed

To support this move cleanly, `ide-core` should depend on ports rather than concrete implementations.

Likely ports include:

- `AssetImportPort`
- `AssetConversionPort`
- `EngineSessionPort`
- `ProjectHostPort`
- `FileSystemPort`
- `StoragePort`
- `DialogPort` or a broader `HostPort` if needed

These ports should describe capabilities, not technologies.

For example:

- good: `startEngineSession(projectPath)`
- bad: `spawnElectronChildProcessWithArgs(...)`

## Expected Benefits

### Clearer Separation of Concerns

The UI stops being an orchestration layer for product logic and returns to being an adapter over the runtime.

### Better Renderer Portability

If Studio keeps both Vue and React renderers, domain behavior only exists once.

### Better Testability

Asset conversion flow, engine session state transitions, and project lifecycle logic can be tested without rendering a page.

### Better Refactor Safety

Large editor behavior changes become runtime refactors instead of UI-wide rewrites.

### Better Long-Term Shape

Studio becomes easier to evolve toward an extensible IDE architecture rather than a renderer-heavy desktop app.

## Risks

### Risk 1: `ide-core` Becomes a God Package

If every technical concern is moved into the core, it will become overloaded and less reusable.

Mitigation:

- move domain orchestration, not infrastructure implementation
- keep host details behind ports
- preserve explicit package boundaries inside the runtime codebase

### Risk 2: Wrong Abstraction Level

If ports are designed around current implementation details, the architecture will still be coupled.

Mitigation:

- define contracts in domain language
- avoid Electron-, Nest-, or transport-specific terminology in core APIs

### Risk 3: Premature Migration Scope

Trying to move every feature at once could stall delivery.

Mitigation:

- move one workflow at a time
- start with the highest-friction domains
- preserve compatibility adapters during migration

## Suggested Migration Order

### Phase 1: Project and Workspace State

Move project-open/workspace semantics into `ide-core` so command/context behavior no longer depends mainly on UI stores.

### Phase 2: Asset Import and Conversion Use Cases

Move `import asset -> convert -> update editor state` flows into runtime use cases backed by ports.

### Phase 3: Engine Session Lifecycle

Represent engine lifecycle as runtime state and commands, with host adapters implementing the concrete start/stop behavior.

### Phase 4: Scene/Preview Coordination

Bring preview, bundle, and live-edit orchestration into runtime commands and effects.

## Decision Rule

Use this rule when deciding whether something belongs in `ide-core`:

If the behavior would still exist with a different renderer or a different host implementation, it is probably runtime domain logic and should move into `ide-core`.

If the behavior only exists because of Vue, Electron, HTTP transport, or operating-system APIs, it should stay outside the core behind an adapter.

## Conclusion

Moving the Zernikalos editor domain into `ide-core` is likely beneficial and aligned with the V2 direction, as long as the migration focuses on domain behavior rather than concrete infrastructure.

The best target is not a bigger UI package or a god-object runtime.
The best target is a framework-agnostic IDE runtime that owns editor meaning, while renderers and hosts only adapt that meaning to concrete environments.

---

## What Remains to Complete

This proposal is directionally correct, but it is not complete until the remaining runtime responsibilities and host boundaries are made explicit.

The outstanding work should be understood as architectural targets, not as claims that a migration has already been finished.

### 1. Engine Session Lifecycle

The engine should become a first-class runtime concept instead of a partially UI-driven integration.

What is still needed:

- introduce `EngineSessionPort` in `ide-core`
- model engine session state explicitly: `idle`, `starting`, `running`, `stopping`, `failed`
- expose engine session view models and subscriptions from `EditorRuntime`
- expose commands or use cases such as `startEngineSession`, `stopEngineSession`, and `restartEngineSession`
- keep actual process spawning, IPC, and operating-system integration in host implementations

### 2. Scene Bundling and Preview Preparation

The editor should own the meaning of scene bundling and preview preparation, even if the concrete export/build work is delegated to the host.

What is still needed:

- a runtime use case for `bundle scene`
- a port for bundle/export execution if the operation depends on host infrastructure
- a runtime use case for preparing preview/runtime data from the current editor state
- a clean flow from `scene state -> bundle/export request -> result/effect -> preview update`

### 3. File-Based Scene Operations

Operations such as loading a `zko` file from disk should be expressed as runtime commands and use cases, not as ad hoc UI actions.

What is still needed:

- a command/use case for `load ZKO from file`
- a file-oriented port or reuse of an existing filesystem contract
- explicit parse/validation/error states surfaced through runtime view models

### 4. Asset Domain Completion

Moving conversion into the runtime is not enough if the surrounding asset model is still fragmented.

What is still needed:

- a clearer asset state model inside the runtime
- status tracking for imports, conversions, failures, retries, and generated outputs
- a stable relationship between imported assets, generated `zko` artifacts, and scene references
- runtime-level error handling and progress reporting instead of UI-local orchestration

### 5. Workspace and Project Semantics

Project/workspace state should be more than a file path remembered by the shell.

What is still needed:

- explicit workspace lifecycle semantics in the runtime
- commands for open, close, and switch workspace/project
- context-key updates driven by runtime state rather than mostly by UI stores
- rules for what session state survives across workspace changes

### 6. Host-Driven Effects

Not every effect must become a port immediately, but the runtime should have a consistent story for how it asks the host to do things.

Possible next step:

- define effect types or ports for dialogs, notifications, navigation, or other host-triggered actions where runtime ownership makes sense

### 7. Renderer Parity

If more than one renderer remains in the repository, they should consume the same runtime API and not diverge in domain behavior.

What is still needed:

- a single runtime contract that both `vueui` and any future renderer can consume
- no renderer-specific business rules for assets, scene operations, or engine state

## Additional Improvements Recommended

Moving the Zernikalos editor domain into `ide-core` will help, but it should be accompanied by broader architectural cleanup.

### Improve Naming Around Adapters and Hosts

The current mental model can become confusing when renderer packages also act as host adapters.

Recommended improvement:

- distinguish clearly between `renderer`, `host adapter`, and `runtime`
- avoid implying that a Vue package owns infrastructure just because it currently contains adapter code

### Strengthen Runtime-Centric APIs

The public runtime API should describe editor capabilities in domain language, not implementation language.

Recommended improvement:

- prefer names like `startEngineSession`, `importAsset`, `bundleScene`, `openWorkspace`
- avoid APIs shaped around transport or platform details

### Improve State Modeling

Several flows will remain fragile if their states are implicit or split across UI and runtime layers.

Recommended improvement:

- use explicit state machines or at least explicit discriminated states for engine lifecycle, asset conversion, and workspace lifecycle
- surface errors, progress, and recoverability in view models

### Improve Testing Strategy

The value of the move increases significantly if the new runtime workflows are easy to test without a renderer.

Recommended improvement:

- add runtime-level tests for asset import/conversion, workspace changes, engine lifecycle, and preview/bundle flows
- use in-memory or mock port implementations in `ide-core` test suites

### Improve Effect Handling Discipline

As more domain workflows move into the runtime, effect handling will matter more.

Recommended improvement:

- standardize how runtime effects are emitted and consumed
- avoid hidden side effects inside renderer composables when the action is really part of a runtime use case

### Improve Documentation of Ownership Boundaries

The architecture will stay easier to maintain if the ownership of each concern is written down clearly.

Recommended improvement:

- document which concepts belong to runtime state, which belong to the host, and which belong to the renderer shell
- keep those boundaries updated as migration progresses

## Summary Table

| Area | Status | Next step |
|------|--------|-----------|
| Engine session | Incomplete | Add runtime state, commands, and `EngineSessionPort` |
| Scene bundling | Incomplete | Add runtime use case and host-backed execution |
| Preview preparation | Incomplete | Move orchestration into runtime |
| Load ZKO from file | Incomplete | Add command/use case plus file contract |
| Asset domain state | Partial | Model asset lifecycle and status explicitly |
| Workspace semantics | Partial | Move lifecycle and context ownership into runtime |
| Host-driven effects | Optional but useful | Define a consistent effect/port strategy |
| Renderer parity | Open decision | Keep one runtime contract across renderers |
| reactui                 | Omitted       | Deprecate or add same adapters as vueui      |
