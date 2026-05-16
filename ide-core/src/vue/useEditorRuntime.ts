import { inject } from 'vue';
import type { EditorRuntime } from '../core/runtime/EditorRuntime.js';
import { EDITOR_RUNTIME_KEY } from './keys.js';

export function useEditorRuntime(): EditorRuntime {
    const runtime = inject(EDITOR_RUNTIME_KEY);
    if (!runtime) {
        throw new Error(
            'useEditorRuntime() requires provideEditorRuntime() in an ancestor'
        );
    }
    return runtime;
}
