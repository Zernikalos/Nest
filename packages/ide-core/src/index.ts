/**
 * @zstudio/ide-core
 *
 * Framework-agnostic IDE runtime. No React, Vue, Svelte, or DOM imports.
 * Use createEditorRuntime() to build the runtime; inject a StoragePort for session persistence.
 * UI adapters (e.g. vueui, reactui) subscribe to view models and dispatch intents.
 */

export * from './contracts/index.js';
export * from './domain/types.js';
export {
    convertZObjectToTreeNode,
    findNodeById,
    findZObjectById,
} from './domain/sceneTreeUtils.js';
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
export {
    createProjectStore,
    getProjectViewModel,
    SET_PROJECT_PATH,
    SET_PROJECT,
    SET_LOADING,
    SET_ERROR,
    CLEAR_PROJECT,
} from './domain/ProjectModule.js';
export type { ProjectState, ProjectViewModel } from './domain/ProjectModule.js';
export {
    createAssetConversionStore,
    getAssetConversionViewModel,
    START_CONVERSION,
    SET_CONVERSION_RESULT,
    SET_CONVERSION_ERROR,
} from './domain/AssetConversionModule.js';
export type {
    AssetConversionState,
    AssetConversionViewModel,
} from './domain/AssetConversionModule.js';
export {
    createEngineSessionStore,
    getEngineSessionViewModel,
    SET_STATUS as ENGINE_SESSION_SET_STATUS,
    SET_ERROR as ENGINE_SESSION_SET_ERROR,
} from './domain/EngineSessionModule.js';
export type {
    EngineSessionState,
    EngineSessionStatus,
    EngineSessionViewModel,
} from './domain/EngineSessionModule.js';
export { SessionService } from './services/SessionService.js';
export type { SessionData } from './services/SessionService.js';
export * from './kernel/EventBus.js';
export * from './kernel/createStore.js';
export * from './ports/index.js';
export type { EngineSessionPort, EngineSessionStartOptions } from './ports/index.js';
export * from './ports/MockStoragePort.js';
export * from './services/CommandService.js';
export * from './services/ContextKeyService.js';
export * from './services/DocumentService.js';
export {
    createEditorRuntime,
    type EditorRuntime,
    type EditorRuntimePorts,
} from './createEditorRuntime.js';
