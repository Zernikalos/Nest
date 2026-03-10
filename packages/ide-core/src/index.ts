/**
 * @zstudio/ide-core
 * Framework-agnostic IDE runtime.
 * No React, Vue, Svelte, or DOM imports.
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
} from './domain/SceneTreeModule.js';
export type { SceneTreeState, SceneTreeViewModel } from './domain/SceneTreeModule.js';
export {
    createWorkbenchStore,
    getWorkbenchViewModel,
    SET_PANEL_SIZES,
} from './domain/WorkbenchModule.js';
export type { WorkbenchState, WorkbenchViewModel } from './domain/WorkbenchModule.js';
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
