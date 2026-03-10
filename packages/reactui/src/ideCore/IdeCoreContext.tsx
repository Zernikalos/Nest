import { createContext } from 'react';
import type { EditorRuntime } from './createEditorRuntime';

const IdeCoreContext = createContext<EditorRuntime | null>(null);

export { IdeCoreContext };
