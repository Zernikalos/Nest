# IDE Core

This section documents the root-level `ide-core` module, the framework-agnostic runtime used by the Studio editor experience.

## Purpose

`ide-core` contains the editor domain model and runtime orchestration that should remain independent from Vue, React, Electron, and the DOM. In application code it is typically consumed through the `@ide-core` alias.

It is responsible for:

- Managing canonical editor state
- Exposing serializable view models for renderers
- Handling document, scene tree, and workbench state transitions
- Providing command and context-key services
- Defining extension-facing contracts such as widgets and runtime stores
- Persisting/restoring editor session data through ports

It is not responsible for:

- Rendering components
- Calling Electron APIs directly
- Owning router state
- Depending on browser storage or DOM APIs

## Package Structure

- `src/contracts/` public runtime contracts and widget interfaces
- `src/kernel/` generic event/store primitives
- `src/domain/` scene tree, workbench, document modules, and shared types
- `src/services/` command, context, session, and document-oriented services
- `src/ports/` abstract interfaces for storage and platform integration
- `src/createEditorRuntime.ts` composition root for the runtime API

## Core Idea

UI frameworks are consumers of the runtime, not co-owners of editor state.

The package follows a simple model:

```text
UI dispatches intents → runtime updates domain state → UI reads view models
```

## Recommended Reading

- [Architecture](./architecture.md)
- [Runtime API](./runtime-api.md)
