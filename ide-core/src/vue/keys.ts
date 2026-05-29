import type { InjectionKey } from 'vue';
import type { EditorRuntime } from '../common/runtime/EditorRuntime.js';

export const EDITOR_RUNTIME_KEY: InjectionKey<EditorRuntime> = Symbol(
    'editorRuntime'
) as InjectionKey<EditorRuntime>;
