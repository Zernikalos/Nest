import { provide } from 'vue';
import type { EditorRuntime } from '../common/runtime/EditorRuntime.js';
import { EDITOR_RUNTIME_KEY } from './keys.js';

/** Provides the editor runtime to the Vue component tree. */
export function provideEditorRuntime(runtime: EditorRuntime): void {
    provide(EDITOR_RUNTIME_KEY, runtime);
}
