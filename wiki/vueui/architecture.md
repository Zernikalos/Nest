# Vue UI Architecture

## Overview

`vueui` is a renderer package built with Vue 3 and Vue Router. Its job is to project runtime state into visual components and to translate UI interaction into runtime intents or host actions.

The package should be understood as an adapter layer, not as the source of truth for editor domain state.

## Layer Model

```text
Vue components/views
        ↓
Composable adapter layer
        ↓
Pinia stores + host APIs + ide-core runtime
        ↓
HTTP/Electron/runtime side effects
```

## Runtime Integration

The runtime entrypoint is re-exported from `src/runtime/createEditorRuntime.ts`, which forwards to `@ide-core`.

The main adapter is `src/composables/useIdeCore.ts`. It:

- injects the shared `EditorRuntime`
- subscribes to scene tree, workbench, and document updates
- exposes helper methods such as `handleSelect`, `handleCloseDocument`, and `onLayoutChange`
- forwards advanced runtime APIs such as command registration, widget registration, and workspace updates

This keeps Vue components relatively thin. Components consume reactive view models rather than reimplementing core editor behavior.

## Routing Model

The router in `src/router/index.ts` defines the top-level product structure:

- `/projects`
- `/editor`
- `/settings`
- `/devices`
- `/exporter`

Inside `/editor`, subroutes such as `/editor/form`, `/editor/code`, and `/editor/viewer` switch the active editor presentation. This means navigation concerns currently live in Vue Router, while open-document concerns live in `ide-core`.

## State Ownership

`vueui` uses multiple state mechanisms on purpose:

- `ide-core` owns editor domain state such as scene tree, document tabs, widget/workbench state, commands, and context keys
- Pinia stores own UI-local or application-local state such as project path, settings, appearance, and transient editor UI data
- API data is fetched through dedicated clients in `src/lib/`

This split is useful as long as the boundary stays explicit: editor behavior belongs in the runtime, while view composition and shell-level behavior belong in Vue.

## Important Building Blocks

### Components

Editor-oriented components such as `SceneTree.vue`, `DocumentTabBar.vue`, and `EditorLayout.vue` render runtime-driven or shell-driven state.

### Composables

Composables are the orchestration layer. Notable examples:

- `useIdeCore.ts` bridges Vue to the runtime
- `useProject.ts` coordinates project loading and project-facing state
- `useElectronProjectIntegration.ts` handles Electron-triggered project flows
- `useNestEditor.ts` and `useZObjectState.ts` adapt editor-facing data for concrete views

### Stores

Stores in `src/stores/` should remain focused on local concerns. They are a good place for UI preferences and shell state, but they should not become a second implementation of editor domain rules already present in `ide-core`.

## Design Constraint

The package becomes harder to maintain when the same concept is modeled both in Vue state and in the runtime. The safest direction is:

- runtime owns canonical editor state
- Vue renders view models and handles navigation/presentation
- host integrations stay behind explicit adapters

That keeps `vueui` replaceable and preserves the value of the framework-agnostic core.
