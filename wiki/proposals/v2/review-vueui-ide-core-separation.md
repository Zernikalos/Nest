# Review: North Star vs vueui/ide-core — Separation and Gaps

## Context

- **North Star** ([north-star.md](./north-star.md)): headless IDE runtime; UI as projection; framework-agnostic core; Electron as platform adapter.
- **Current focus**: vueui + ide-core. Goal: assess what is still framework-dependent and what could improve separation, connection with Electron/server, and internal editor data format.

---

## What Is Already Aligned

1. **ide-core is framework-agnostic**  
   No React, Vue, DOM, or browser APIs. Contracts live in `contracts/index.ts` (RuntimeIntent, RuntimeEffect, WidgetContribution, WidgetController, RuntimeStore).

2. **Single runtime, multiple adapters**  
   Both reactui and vueui use the same `createEditorRuntime()` from `@zstudio/ide-core`. Vue’s `useIdeCore` only injects the runtime and maps view models + intents; no core logic lives in Vue.

3. **View models as projection**  
   Scene tree and workbench state are in the runtime; Vue subscribes and renders from `getSceneTreeViewModel()` / `getWorkbenchViewModel()`. Intents go through `dispatchSceneTree` / `dispatchWorkbench`.

4. **Session persistence**  
   `SessionService` + `StoragePort` keep session (scene tree, workbench, documents) in the runtime. No framework in the persistence layer.

5. **Commands and context keys**  
   `CommandService` and `ContextKeyService` live in the runtime. Handlers are registered from the UI layer, but “when” a command runs and “what context is” are runtime concerns.

---

## Gaps and Framework-Dependent Areas

### 1. Document view model not used in Vue

**State:** ide-core has a full document model: `getDocumentViewModel()`, `subscribeDocuments()`, `dispatchDocuments()`, synced with scene tree (e.g. open tab = open document with `zobject://${nodeId}`).

**In vueui:** None of these are used. Editor “tabs” are Vue Router routes (Form / Code / Viewer), not the runtime’s opened documents. So:

- Runtime owns: “which ZObjects are open as documents” and “active document”.
- Vue owns: “which view (form/code/viewer) is shown” via router.

**Recommendation:** Expose document view model in `useIdeCore` and drive a **tab bar of open documents** from it (e.g. list of `openedDocuments` + `activeUri`). Form/Code/Viewer can stay as sub-views of the active document. That aligns with Theia-style “open editors” and makes document state the single source of truth.

---

### 2. Workbench / widgets not used in Vue layout

**State:** Runtime has workbench areas (`left` / `right` / `bottom` / `center`), `registerWidget`, and widget lifecycle. `WorkbenchModule` and `getWorkbenchViewModel()` are implemented.

**In vueui:** `EditorLayout.vue` is fixed: left pane = SceneTree, right pane = slot. No `registerWidget`, no rendering from `workbenchViewModel.areas`. So the workbench is not yet the driver of layout.

**Recommendation (incremental):**

- Register at least one widget (e.g. “Scene Tree”) as a contribution and render the main editor layout from `workbenchViewModel.areas` so that one area is filled by that widget.
- Then add more widgets (e.g. inspector, viewer) as contributions. Vue’s job: given `areas[area]` (list of widget descriptors), render the corresponding Vue component for each widget id (e.g. map `"scene-tree"` → `SceneTree.vue`). That keeps layout and widget set in the runtime and Vue as a pure renderer.

---

### 3. Platform ports: only Storage is injected

**State:** ide-core defines several ports in `ports/index.ts`: `StoragePort`, `FileSystemPort`, `IpcPort`, `KeymapPort`, `TelemetryPort`. `createEditorRuntime()` only accepts `EditorRuntimePorts.storage`.

**In vueui (and reactui):** Always `createLocalStorageStoragePort()`. So in Electron, session is still stored in renderer localStorage, not in main process or user data dir.

**Recommendation:**

- **Electron:** Add an `ElectronStoragePort` (e.g. using `electron-store` or a file under `app.getPath('userData')`) and pass it when creating the runtime in the Electron build. That gives session persistence per app and avoids relying on browser storage.
- **Optional:** Extend `EditorRuntimePorts` with optional `dialog?` and `menuContext?` (or a single `HostPort`) so that “show save dialog” and “send menu context” are platform adapters. Then vueui only calls `ports.dialog.showSaveProjectDialog(projectName)` or `ports.menuContext.send({ projectOpen })`; in web these can be no-op or mocks, in Electron they delegate to `window.NativeZernikalos`. That removes direct `window` usage from composables and keeps “how” in the host layer.

---

### 4. Router and navigation in composables

**State:** `useProject` and `useElectronProjectIntegration` use `useRouter()` and call `router.push(...)` after commands (e.g. open project → push `/projects`). They also call `window.NativeZernikalos?.sendMenuContext` and `window.NativeZernikalos?.showSaveProjectDialog` directly.

**Issue:** Navigation and host APIs are mixed into the same composables that register commands. That’s acceptable for an adapter, but it ties “what happens after a command” and “how to show dialogs/menu” to Vue Router and `window`.

**Recommendation:**

- Treat “navigate to route” as an **effect** or **adapter concern**: e.g. command handler returns or runtime emits “navigate”, and a small Vue layer maps that to `router.push`. That keeps the list of routes in one place and makes it easier to test or swap UI.
- Move `window.NativeZernikalos` behind a **platform port** (see above). Then useProject / useElectronProjectIntegration only call the port; the app root (or ElectronProvider) provides the implementation (web vs Electron).

---

### 5. Project state: source of truth in Pinia

**State:** `projectStore` holds `projectFilePath`; `useProject` fetches project via `projectApi` and keeps `project` in a ref. `contextKey.set('projectOpen', ...)` is updated from vueui by watching `projectStore.projectFilePath`.

**Issue:** The runtime gets “projectOpen” for commands, but the source of truth is Pinia. The north star doesn’t require “current project” to live in the runtime, but for a Theia-like model, “current workspace” could be a runtime concept so that commands and session can depend on it in one place.

**Recommendation (optional, medium term):** Introduce something like `runtime.setWorkspace(path: string | null)` and `runtime.getWorkspace(): string | null`, and have the runtime derive `projectOpen` from that. Vue would call `setWorkspace` when opening/closing a project and still use Pinia (or a single ref) only for “what the UI last set”, or drop it and read from runtime. That would centralize “editor workspace” in the core.

---

### 6. Settings and localStorage

**State:** `settingsStore` (vueui) uses `localStorage` directly for persistence.

**Recommendation:** If settings are considered part of “application state” that should work in Electron and tests, introduce a second port (e.g. `PreferencesPort` or reuse `StoragePort` with a key prefix like `prefs:`). Then settings load/save go through the port; in Electron you can point it to the same Electron storage. ide-core doesn’t have to own preferences; only the adapter and the port need to be shared.

---

### 7. Type and API clarity

**State:** In vueui’s `useIdeCore`, `unregisterCommand` is obtained via a cast: `(runtime as unknown as { unregisterCommand?: ... }).unregisterCommand`.

**Recommendation:** Ensure the public `EditorRuntime` type (or the inferred return type of `createEditorRuntime`) explicitly includes `unregisterCommand` so adapters don’t need a cast.

---

## Suggested Order of Work

| Priority | Item | Benefit |
|----------|------|---------|
| 1 | Expose document view model and subscriptions in `useIdeCore`; add a document tab bar driven by runtime | Single source of truth for “open documents”; aligns with north star and Theia |
| 2 | Add Electron storage port and use it when running in Electron | Session survives and is per-app; clear platform boundary |
| 3 | Drive layout from workbench view model; register at least one widget (e.g. Scene Tree) | Layout and widget set in runtime; Vue only renders |
| 4 | Introduce optional platform port(s) for dialog + menu context; remove direct `window.NativeZernikalos` from composables | Testable, swappable host behavior; less framework/host coupling |
| 5 | (Optional) Workspace in runtime; preferences via port | Cleaner separation of “editor state” vs “UI convenience state” |

---

## Summary

- **ide-core** is in good shape: no framework deps, clear contracts, session and documents in runtime.
- **vueui** is a thin adapter for scene tree and workbench view models and intents, but it does not yet use **documents** or **workbench-driven layout**, and it still relies on **Vue Router** and **window** for navigation and Electron APIs.
- To get closer to a Theia-like, north-star design: (1) use the document model for tabs, (2) drive layout from the workbench and widgets, (3) inject storage (and optionally other ports) from the host so Electron and web differ only in the adapter layer. That would give you a clearer format for “elements, their connection with electron/server, and internal editor data” without rewriting the core.
