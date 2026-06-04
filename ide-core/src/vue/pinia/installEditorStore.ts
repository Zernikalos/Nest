import type { Pinia } from 'pinia';
import type { EditorRuntime } from '../../common/runtime/EditorRuntime.js';
import { bindEditorStoreRuntime } from './editorStore.js';

/** Binds the editor runtime to the Pinia editor store (call once after createPinia). */
export function installEditorStore(_pinia: Pinia, runtime: EditorRuntime): void {
    bindEditorStoreRuntime(runtime);
}
