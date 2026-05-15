import type { EditorRuntime, EditorRuntimePorts } from './EditorRuntime.js';
import { EditorRuntimeImpl } from './EditorRuntime.js';

export type { EditorRuntime, EditorRuntimePorts } from './EditorRuntime.js';

/** Creates the editor runtime with optional platform ports. */
export function createEditorRuntime(ports?: EditorRuntimePorts): EditorRuntime {
    return new EditorRuntimeImpl(ports);
}
