/**
 * Vue / Pinia integration and renderer host contracts for @zstudio/ide-core.
 * Framework-agnostic domain remains in `../common`.
 */

export type {
    HostPort,
    HostDialogsPort,
    MenuContextSnapshot,
    LoadZkoDialogResult,
    ImportFileDialogResult,
} from './host/hostPort.js';
export { HostPlatform } from './host/hostPort.js';
export { createEmptyHostPort } from './host/emptyHostPort.js';

export { EDITOR_RUNTIME_KEY } from './keys.js';
export { provideEditorRuntime } from './provideEditorRuntime.js';
export { useEditorRuntime } from './useEditorRuntime.js';
export { useEditorSlice } from './useEditorSlice.js';
export { setupSceneTreePanel } from './setupSceneTreePanel.js';
export { installEditorStore } from './pinia/installEditorStore.js';
export { useEditorStore } from './pinia/editorStore.js';
