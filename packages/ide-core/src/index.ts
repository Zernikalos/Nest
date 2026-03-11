/**
 * @zstudio/ide-core
 *
 * Framework-agnostic IDE runtime. No React, Vue, Svelte, or DOM imports.
 * Use createEditorRuntime() to build the runtime; inject a StoragePort for session persistence.
 * UI adapters (e.g. vueui, reactui) subscribe to view models and dispatch intents.
 */

export * from './contracts/index.js';
export * from './domain/types.js';
export * from './domain/sceneTreeUtils.js';
export {
    createSceneTreeStore,
    getSceneTreeViewModel,
    SELECT_NODES,
    OPEN_TAB,
    CLOSE_TAB,
    SET_ACTIVE_TAB,
    SET_TREE,
    TOGGLE_NODE_EXPANDED,
    SET_FOCUSED_NODE,
} from './domain/SceneTreeModule.js';
export type { SceneTreeState, SceneTreeViewModel } from './domain/SceneTreeModule.js';
export {
    createWorkbenchStore,
    getWorkbenchViewModel,
    SET_PANEL_SIZES,
    REGISTER_WIDGET,
    OPEN_WIDGET,
    CLOSE_WIDGET,
    ACTIVATE_WIDGET,
} from './domain/WorkbenchModule.js';
export type { WorkbenchState, WorkbenchViewModel } from './domain/WorkbenchModule.js';
export {
    createDocumentStore,
    getDocumentViewModel,
    OPEN_DOCUMENT,
    CLOSE_DOCUMENT,
    SET_ACTIVE_DOCUMENT,
    SET_DOCUMENT_DIRTY,
    SET_DOCUMENT_VIEW_STATE,
    RESTORE_DOCUMENTS,
} from './domain/DocumentModule.js';
export type { DocumentState, DocumentViewModel, DocumentRecord } from './domain/DocumentModule.js';
export { SessionService } from './services/SessionService.js';
export type { SessionData } from './services/SessionService.js';
export * from './kernel/EventBus.js';
export * from './kernel/createStore.js';
export * from './ports/index.js';
export * from './ports/MockStoragePort.js';
export * from './services/CommandService.js';
export * from './services/ContextKeyService.js';
export * from './services/DocumentService.js';
export {
    createEditorRuntime,
    type EditorRuntime,
    type EditorRuntimePorts,
} from './createEditorRuntime.js';
