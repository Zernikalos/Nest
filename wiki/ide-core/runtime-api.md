# IDE Core Runtime API

## Entry Point

`createEditorRuntime()` from `src/core/runtime/createEditorRuntime.ts` (import `@ide-core`).

## Snapshot and subscriptions

| API | Use |
|-----|-----|
| `getSnapshot()` | Full `EditorSnapshot` |
| `getSlice(key)` | One slice (`scene` merges documents for opened tabs) |
| `onChange` / `subscribe` | Any domain change (coalesced per microtask) |
| `subscribeSlice(key, listener)` | Only the editor(s) for that slice |

In Vue, prefer `@ide-core/vue`: `useEditorStore()`, `useEditorSnapshot()`, or `useEditorSlice(key)`.

## Domain editors

| Editor | Examples |
|--------|----------|
| `scene` | `selectNodes`, `setTreeFromRoot`, `toggleExpanded` |
| `documents` | `openZObject`, `close`, `setActive`, `restore` |
| `workbench` | `register`, `open`, `setPanelSizes`, `getController` |
| `project` | `open`, `close`, `create`, `addAsset`, `getPath` |
| `engine` | `start`, `stop`, `restart` |
| `assetConversion` | `convert`, `setProjectPersistWarning` |

Use editor methods from UI — not internal `patch()` or store internals.

## Orchestration

`EditorOrchestrator` syncs scene tree ↔ documents. Wired from `SceneTreeEditor` and `DocumentsEditor`.

## Widget model

`WidgetContribution` + `WorkbenchEditor` lifecycle. `createSceneTreeWidgetContribution()` for the scene tree panel.

## Commands, context, session

- `commands.execute/register/unregister/has`
- `context.set/get/getBool/evaluate`
- `session.save/restore/hydrate` (with `StoragePort`)
