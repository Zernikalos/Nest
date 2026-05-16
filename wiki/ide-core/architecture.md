# IDE Core Architecture

## Overview

`ide-core` is the editor engine for Zernikalos Studio V2. It is designed to be portable across UI frameworks by keeping state, domain logic, and extension contracts free of framework dependencies.

The package centers around `createEditorRuntime()`, which composes domain editors and cross-cutting coordinators into a single public runtime API.

## Architectural Principles

### 1. Framework Agnostic

No React, Vue, Svelte, Electron, or DOM imports belong in the package.

### 2. Canonical State in the Runtime

Scene tree, documents, workbench layout, commands, and context keys live in the runtime so that renderers do not need to reimplement those rules.

### 3. Serializable View Models

Renderers consume plain data. The runtime does not return framework components or renderer-specific objects.

### 4. One file per domain (`editor/*`)

Each domain area extends `DomainEditorBase` (Zustand vanilla + Immer) and exposes a public editor class:

- `editor/sceneTree.ts` — `SceneTreeEditor`
- `editor/documents.ts` — `DocumentsEditor`
- `editor/workbench.ts` — `WorkbenchEditor` (includes widget lifecycle)
- `editor/project.ts` — `ProjectEditor`
- `editor/engine.ts` — `EngineEditor`
- `editor/assetConversion.ts` — `AssetConversionEditor`

Domain methods use `patch()` / `patchSilent()` on Immer drafts. UI adapters call named methods (`openZObject`, `selectNodes`, `setPanelSizes`), not `dispatch()`.

### 5. Single commit pipeline

Each editor receives `onCommit` from `EditorRuntime` (session persist debounce + `EditorChangeNotifier`). `patch()` triggers commit; `patchSilent()` is used for orchestrator sync and session hydration batches.

### 6. Snapshot bridge for UI

`EditorRuntime.getSnapshot()` / `getSlice()` / `subscribeSlice()` aggregate and project view models. Vue adapters use `@ide-core/vue` (`useEditorStore`, `useEditorSnapshot`) in `src/vue/`; core lives in `src/core/`.

## Main Subsystems

### Contracts

`src/core/contracts/index.ts` defines the runtime boundary:

- `RuntimeEffect` (optional command handler payloads)
- `WidgetContribution` / `WidgetController`
- `EditorSnapshot`

### Domain editors (`src/core/editor/`)

Immer-backed stores with imperative editor classes. Cross-cutting scene ↔ document rules live in `EditorOrchestrator`.

### Services (cross-cutting only)

- `CommandService`
- `ContextKeyService`
- `SessionService`

### Ports

- `StoragePort`, `ProjectPort`, `EngineSessionPort`, `AssetConversionPort`, etc.

Only interfaces belong in `ide-core`; implementations belong in adapters or hosts.

## Composition Root

`src/core/runtime/createEditorRuntime.ts` wires:

- domain editors (`DomainEditorBase` + `onCommit`)
- `EditorOrchestrator` (scene ↔ documents)
- `SessionCoordinator` (persist / hydrate)
- `EditorChangeNotifier`

## Intended Relationship with UI Packages

Packages such as `vueui` should:

- instantiate the runtime
- read `getSnapshot()` and subscribe with `onChange`
- call editor methods on user input
- provide host-specific ports

They should not fork the domain logic that already exists here.
