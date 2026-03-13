# IDE Core Runtime API

## Entry Point

The main entry point is `createEditorRuntime()` from `src/createEditorRuntime.ts`.

It produces a runtime object that acts as the editor-facing API for renderer adapters.

## Runtime Responsibilities

A renderer consuming the runtime can typically:

- read scene tree, workbench, and document view models
- subscribe to scene tree, workbench, and document updates
- dispatch intents to scene tree, workbench, and document stores
- register and unregister commands
- execute commands
- work with context keys
- register and unregister widgets
- open widgets
- save and restore session state
- update or query the current workspace

## Important View Models

### Scene Tree View Model

Used to render the editor tree, selection state, expansion state, and active node information.

### Document View Model

Used to render open documents/tabs, active document, and tab-level metadata.

### Workbench View Model

Used to render widget placement across workbench areas such as `left`, `right`, `bottom`, and `center`.

## Important Intents

The package exports intent constants for common state transitions, including:

- scene tree intents such as `SELECT_NODES`, `OPEN_TAB`, `CLOSE_TAB`, `SET_ACTIVE_TAB`
- document intents such as `OPEN_DOCUMENT`, `CLOSE_DOCUMENT`, `SET_ACTIVE_DOCUMENT`
- workbench intents such as `REGISTER_WIDGET`, `OPEN_WIDGET`, `CLOSE_WIDGET`, `SET_PANEL_SIZES`

These constants help keep adapters explicit and consistent.

## Widget Model

Widgets are registered through `WidgetContribution` contracts. The runtime owns widget lifecycle, while the renderer is expected to render a widget by its identifier and view model.

This is important because it preserves a clean split:

- runtime decides what is open and where it belongs
- UI decides how it looks

## Session Persistence

Session persistence is optional and depends on the provided `StoragePort`.

This allows the same runtime to run:

- in browser-only development with local storage
- in Electron with an app-managed storage implementation
- in tests with a mock storage implementation

## Practical Guidance

- Put domain behavior in the runtime API, not in renderer hooks
- Prefer extending contracts over leaking framework assumptions into the core
- Keep all public runtime outputs serializable and renderer-neutral
