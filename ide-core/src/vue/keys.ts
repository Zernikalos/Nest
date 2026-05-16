import type { InjectionKey } from 'vue';
import type { EditorRuntime } from '../core/runtime/EditorRuntime.js';

export const EDITOR_RUNTIME_KEY: InjectionKey<EditorRuntime> = Symbol(
    'editorRuntime'
) as InjectionKey<EditorRuntime>;
