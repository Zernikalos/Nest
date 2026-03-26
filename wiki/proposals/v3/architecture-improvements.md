# V3 Proposal: Architecture Improvements (DI, Contributions, Modules)

## Status

Draft. Builds on V2 ide-core and proposes structural improvements.

## Context

Today the IDE composes the runtime in a single place: a factory `createEditorRuntime(ports)` is called with explicitly built adapters (storage, project, assetConversion, engineSession), and the resulting `EditorRuntime` is provided to the Vue tree via `provide/inject`. There is no dependency-injection container and no generic contribution model. Features that want to add commands or widgets do so by calling methods on the runtime from the host (e.g. Vue components), but the host remains the single composition root.

Platforms like Eclipse Theia use a different approach: a DI container (e.g. Inversify) is the composition root. Extensions and the core register *bindings* (interface → implementation or contribution type → implementation). At startup the container is built from many modules; no single component lists every dependency. Contribution points allow many modules to contribute commands, menus, or startup behavior without the core knowing them in advance.

This proposal suggests moving toward that style so that:

1. The runtime is composed from a container, not a single factory call with hand-wired ports.
2. Features extend the IDE via contribution points (e.g. CommandContribution, WidgetContribution) instead of ad-hoc registration from the host.
3. Ports and platform services are bound in the container by the host or by adapter modules, not passed once at creation time.

## 1. Dependency Injection as the Composition Root

### Current state

- `createEditorRuntime(ports)` instantiates all stores and services internally.
- The host (e.g. `IdeCoreProvider.vue`) builds the ports and calls the factory once.
- Only one “service” is effectively injectable: the `EditorRuntime` instance itself.

### Proposed direction

- Introduce a **DI container** (e.g. Inversify) for the frontend runtime (and optionally a separate one for the backend).
- **Ports** are bound by the host or by adapter modules: e.g. `bind(StoragePort).to(LocalStorageStoragePort)` in the browser, or `bind(StoragePort).to(ElectronStoragePort)` in Electron.
- **Core services** (CommandService, ContextKeyService, SessionService, stores) are either bound by the core module or created by a “runtime factory” that resolves ports from the container.
- The **EditorRuntime** (or a facade) is obtained from the container after all modules have been loaded (e.g. `container.get(EditorRuntime)`), instead of being built by a single function that receives ports as arguments.

Effects:

- The core no longer takes a single `ports` bag; it resolves `StoragePort`, `ProjectPort`, etc. from the container when building the runtime (or those are injected into the runtime factory).
- Adapters (vueui, electronapp) contribute container modules that bind the appropriate port implementations for their environment.
- Tests can bind mock ports without the host component.

## 2. Contribution Points (Extension Mechanism)

### Current state

- Commands are registered by calling `runtime.registerCommand(id, handler)` from the host or from code that has a reference to the runtime.
- Widgets are registered with `runtime.registerWidget(contribution)`; again, the host or some component must hold the runtime and call this.
- There is no generic “give me all contributions of type X” mechanism.

### Proposed direction

- Define **contribution interfaces** that extensions (or internal modules) implement, for example:
  - `CommandContribution` — register commands (and optionally keybindings/menus).
  - `WidgetContribution` — already exists as a descriptor; can be the contribution type that modules bind to a provider.
  - `FrontendApplicationContribution` — optional hook for “run when the frontend app has started” (e.g. restore session, connect to backend).
- The **core** (or a “contribution runner”) injects `ContributionProvider<CommandContribution>` and iterates over all registered contributions to register commands. Similarly for widgets: the workbench asks the contribution provider for all `WidgetContribution` and registers them.
- Extensions and feature modules **bind** their implementations: e.g. `bind(CommandContribution).to(SceneTreeCommandContribution)` in a container module. They do not need a reference to the runtime at module load time; they only need to implement the interface and register the binding.

Effects:

- Adding a new command set or widget does not require touching a central “register all commands” list; it only requires a new module that binds to the contribution interface.
- The runtime (or a bootstrap component) collects all contributions and wires them. This is the same idea as Theia’s contribution points: the center defines the hook, many modules contribute.

## 3. Composition by Container Modules

### Current state

- A single component (`IdeCoreProvider.vue`) decides which storage to use, creates the project port, the asset conversion port, the engine session port, and calls `createEditorRuntime({ storage, project, assetConversion, engineSession })`. All composition is in one place.

### Proposed direction

- Split **container modules** by concern or by package:
  - **ide-core** exports a container module that binds kernel and domain services and the runtime (or runtime factory), and binds contribution providers for CommandContribution, WidgetContribution, etc. It does **not** bind concrete ports; it may bind them to a symbol or leave them to be bound by the host.
  - **vueui** (or a sub-package like `vueui-browser` / `vueui-electron`) exports a container module that binds the ports appropriate for that environment (e.g. `StoragePort`, `ProjectPort`, `AssetConversionPort`, `EngineSessionPort`). In Electron, these might delegate to IPC or HTTP; in browser, to localStorage and REST.
  - Optional: **feature modules** (e.g. “scene tree”, “assets”) export container modules that bind their CommandContribution and any widgets they provide.
- **Application bootstrap** loads the list of container modules (e.g. core + vueui-electron + feature modules), creates the container, then gets `EditorRuntime` (or `FrontendApplication`) from the container and calls `start()` or passes the runtime to Vue via `provide`.

Effects:

- No single file owns “all the wiring.” Each package or feature owns its bindings. Adding a new feature or port implementation is adding a module to the list, not editing the central provider.
- Aligns with the idea that “contributions are the center” for extensibility: the center defines the contribution types and collects them; the edges (modules) contribute.

## 4. Ports: Keep Interfaces in ide-core, Implementations in Adapters

- **Port interfaces** (StoragePort, ProjectPort, AssetConversionPort, EngineSessionPort, etc.) stay in `ide-core`; they define the contract the runtime needs.
- **Implementations** live in adapters (vueui, electronapp, or dedicated adapter packages). In a DI-based design, those implementations are bound in the container by the adapter module (e.g. `bind(ProjectPort).to(HttpProjectPort)`).
- Optionally, a **separate package** only for port interfaces (and shared types) could be introduced if we want ide-core to depend on a minimal “ide-contracts” or “ide-ports” package; for V3 we can keep ports in ide-core and only change *how* implementations are supplied (via container instead of a single `ports` argument).

## 5. Phasing (Suggested)

- **Phase A — Container in the frontend:** Introduce the DI container in the Vue app. Keep `createEditorRuntime(ports)` but have the container resolve the ports (from bindings provided by a “vueui” module) and then call the factory. The runtime is still a single object; only the way ports are obtained changes.
- **Phase B — Contribution points:** Introduce `CommandContribution` (and optionally `MenuContribution`) and a `ContributionProvider`. Migrate existing command registration to contributions bound in modules. Optionally do the same for widgets (widget contributions already exist; they just need to be collected from a provider instead of registered by the host).
- **Phase C — Split container modules:** Move port bindings into a dedicated vueui container module; move command/widget bindings into feature modules. Bootstrap becomes “load modules, get runtime, provide to Vue.”
- **Phase D (optional) — Backend container:** If we want a Theia-like backend with its own DI container and RPC-exposed services, introduce a backend container and wire frontend proxies to it; this aligns with the “frontend–backend boundary” proposal in `frontend-backend-boundary.md`.

## Summary

| Aspect        | Current (V2)                          | Proposed (V3)                                              |
|---------------|----------------------------------------|------------------------------------------------------------|
| Composition   | Single factory `createEditorRuntime(ports)` | DI container; ports and runtime resolved from container   |
| Extensibility | Host calls `registerCommand` / `registerWidget` | Contribution points; modules bind implementations           |
| Wiring        | One place (e.g. IdeCoreProvider.vue)   | Multiple container modules (core + adapters + features)    |
| Ports         | Passed as bag to factory               | Bound in container by adapter modules                      |

These changes make the IDE architecture closer to Theia’s without dropping the existing concepts (ports, intents/effects, view models, widgets). They can be adopted incrementally as described in the phasing section.
