/**
 * @zstudio/ide-core
 *
 * Framework-agnostic IDE runtime. No React, Vue, Svelte, or DOM imports.
 * Use `createEditorRuntime()` to build the runtime; inject platform ports (e.g. `StoragePort`) for
 * session persistence and host I/O.
 *
 * ## Module layout
 *
 * ```text
 *                    ┌─────────────────────────────────────┐
 *                    │  createEditorRuntime(ports)         │
 *                    │  EditorRuntime (namespaced API)     │
 *                    │  getSnapshot() · getSlice()         │
 *                    │  onChange() · subscribeSlice()      │
 *                    └─────────────────┬───────────────────┘
 *                                      │
 *         ┌────────────────────────────┼────────────────────────────┐
 *         │                            │                            │
 *         ▼                            ▼                            ▼
 *  ┌──────────────┐           ┌─────────────────┐           ┌──────────────┐
 *  │  contracts   │           │     runtime     │           │   services   │
 *  │ Widget*      │           │ EditorOrchestr. │           │ Command      │
 *  │ Snapshot     │           │ SessionCoord.   │           │ ContextKey   │
 *  │ RuntimeEffect│           │ ChangeNotifier  │           │ Session      │
 *  └──────┬───────┘           └────────┬────────┘           └──────┬───────┘
 *         │                            │                            │
 *         │                            │                            │
 *         ▼                            ▼                            ▼
 *  ┌──────────────┐           ┌─────────────────┐           ┌──────────────┐
 *  │    domain    │           │     editor      │           │    ports     │
 *  │ types, uri   │◄──────────│ *Editor classes │──────────►│ Storage      │
 *  │ tree utils   │           │ DomainEditorBase│           │ Project      │
 *  └──────────────┘           │ Zustand + Immer │           │ Engine…      │
 *         ▲                   └────────┬────────┘           └──────────────┘
 *         │                            │
 *         │                     ┌──────┴──────┐
 *         │                     │   widgets   │
 *         └─────────────────────│ WidgetCtrl  │
 *                               └─────────────┘
 *
 * Companion layers (same package): `@ide-core/vue`, `@ide-core/electron`
 *   • useEditorStore (actions), useEditorRuntime, useEditorSlice (reactive reads)
 *   • provideEditorRuntime / installEditorStore
 *
 * ## Data flow
 *
 * Write path (user gesture → state):
 *   1. Adapter (vueui) calls a namespaced method, e.g. runtime.scene.selectNodes(),
 *      runtime.documents.openZObject(), runtime.workbench.setPanelSizes().
 *   2. *Editor applies an Immer recipe via patch() (or patchSilent() for batched/orchestrated
 *      updates that must not fan out commits per intermediate step).
 *   3. patch() invokes the shared onCommit from EditorRuntimeImpl:
 *        → SessionCoordinator.scheduleSave() (250 ms debounce → StoragePort)
 *        → EditorChangeNotifier.notify() → runtime.onChange() subscribers refresh UI.
 *   4. Scene/documents editors delegate cross-domain rules to EditorOrchestrator:
 *        • selectNodes / tree focus → open matching zobject:// tab
 *        • setActive / open / close document → sync scene selection & activeNode
 *        (DocumentsEditor owns tab list; scene VM derives openedNodes from document state.)
 *
 * Read path (state → UI):
 *   1. runtime.getSnapshot() or runtime.getSlice(key) builds readonly view models.
 *   2. subscribeSlice(key) listens only to the relevant domain editor(s); scene also watches
 *      documents for openedNodes / activeNode projection.
 *   3. Vue adapters use `@ide-core/vue` (useEditorRuntime / useEditorSlice); they do not
 *      mirror canonical state with manual onChange + ref copies.
 *
 * Session lifecycle:
 *   • After scene.setTreeFromRoot(), SessionCoordinator.hydrate() loads JSON from StoragePort
 *     and applySession() restores selection, expansion, workbench layout, and documents
 *     (patchSilent + single onCommit at the end).
 *   • runtime.session.save() / restore() expose explicit persist; commands also trigger
 *     scheduleSave() on execute.
 *
 * Host I/O (ports, not in snapshot):
 *   • ProjectEditor / EngineEditor / AssetConversionEditor call ProjectPort, EngineSessionPort,
 *     AssetConversionPort; results are written back with patch() like any other domain change.
 *   • Workbench widgets use WidgetContribution.createController(); panel VMs are optional
 *     projections via WidgetController.getViewModel().
 * ```
 */

export * from './contracts/index.js';
export type { SubscribableEditor } from './contracts/store.js';
export * from './domain/types.js';
export { HostPlatform } from './host/enums.js';
export {
    convertZObjectToTreeNode,
    findNodeById,
    findZObjectById,
} from './domain/sceneTreeUtils.js';
export {
    nodeIdToDocumentUri,
    documentUriToNodeId,
    isZObjectDocumentUri,
} from './domain/documentUri.js';

export type { SceneTreeState, SceneTreeViewModel } from './editor/sceneTree.js';
export { getSceneTreeViewModel } from './editor/sceneTree.js';
export type { DocumentState, DocumentViewModel, DocumentRecord } from './editor/documents.js';
export { getDocumentViewModel } from './editor/documents.js';
export type { WorkbenchState, WorkbenchViewModel } from './editor/workbench.js';
export { getWorkbenchViewModel } from './editor/workbench.js';
export type { ProjectState, ProjectViewModel } from './editor/project.js';
export { getProjectViewModel } from './editor/project.js';
export type {
    AssetConversionState,
    AssetConversionViewModel,
} from './editor/assetConversion.js';
export {
    EngineSessionStatus,
    type EngineSessionState,
    type EngineSessionViewModel,
} from './editor/engine.js';
export { getEngineSessionViewModel } from './editor/engine.js';

export { SceneTreeEditor } from './editor/sceneTree.js';
export { DocumentsEditor } from './editor/documents.js';
export { WorkbenchEditor } from './editor/workbench.js';
export { ProjectEditor } from './editor/project.js';
export { EngineEditor } from './editor/engine.js';
export { AssetConversionEditor } from './editor/assetConversion.js';
export { DomainEditorBase } from './editor/DomainEditorBase.js';
export type { DomainCommitHandler } from './editor/DomainEditorBase.js';

export { SessionService } from './services/SessionService.js';
export type { SessionData } from './services/SessionService.js';
export * from './ports/index.js';
export * from './ports/MockStoragePort.js';
export * from './services/CommandService.js';
export * from './services/ContextKeyService.js';
export * from './menu/index.js';
export {
    DEFAULT_MENU_CONTEXT,
    type MenuContextSnapshot,
} from './host/menuContext.js';
export type { LoadZkoDialogResult, ImportFileDialogResult } from './host/dialogTypes.js';
export type { HostDialogsPort } from './host/hostDialogsPort.js';
export { EditorOrchestrator } from './runtime/EditorOrchestrator.js';
export { createSceneDocumentsEditors } from './runtime/createSceneDocumentsEditors.js';
export {
    SceneTreeWidgetController,
    createSceneTreeWidgetContribution,
} from './widgets/SceneTreeWidgetController.js';
export type { SceneTreeWidgetViewModel } from './widgets/SceneTreeWidgetController.js';
export {
    createEditorRuntime,
    type EditorRuntime,
    type EditorRuntimePorts,
    type EditorSnapshotKey,
} from './runtime/createEditorRuntime.js';
