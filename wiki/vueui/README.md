# Vue UI

This section documents the `vueui` package, the Vue-based application shell for Zernikalos Studio.

## Purpose

`vueui` is the renderer-side adapter between the user interface and the framework-agnostic editor runtime exported by `@zstudio/ide-core`.

It is responsible for:

- Rendering pages, layouts, and editor views with Vue 3
- Mapping user interaction to runtime intents
- Hosting application-level routing
- Integrating with host capabilities such as Electron APIs
- Managing UI-local concerns that do not belong in the core runtime

It is not responsible for:

- Owning canonical editor state
- Implementing domain rules for scene tree, documents, or workbench
- Embedding framework-specific logic into `ide-core`

## Key Directories

- `src/components/` reusable UI building blocks and editor-facing components
- `src/views/` route-level pages such as Projects, Editor, and Settings
- `src/composables/` orchestration logic between Vue, stores, host APIs, and the runtime
- `src/runtime/` runtime creation and storage adapter wiring
- `src/router/` application routes and nested editor/settings navigation
- `src/stores/` Pinia stores for UI-local and application-local state
- `src/lib/` API clients and shared UI utilities
- `src/editor/` widget registration and editor-specific composition helpers

## Main Architectural Relationships

- `vueui` consumes `createEditorRuntime()` from `@zstudio/ide-core`
- `useIdeCore()` exposes scene tree, workbench, and document view models to Vue components
- Router state controls page/view navigation
- Pinia stores hold UI-facing state such as project path, settings, and transient editor UI state
- Electron integration is handled in the Vue layer through providers/composables and host-facing types

## Recommended Reading

- [Architecture](./architecture.md)
- [Integration Boundaries](./integration-boundaries.md)
