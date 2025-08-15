import { createContext, useContext } from 'react';
import { type NestInternalEditorState } from './hooks/useNestInternalEditorState';
import type { ZkConvertResult } from '@zernikalos/zkbuilder';

// Extend the internal editor state to include zkResult
interface NestEditorContextType extends NestInternalEditorState {
    zkResult: ZkConvertResult | null;
}

const NestEditorContext = createContext<NestEditorContextType | undefined>(undefined);

export const useNestEditorContext = () => {
    const context = useContext(NestEditorContext);
    if (context === undefined) {
        throw new Error('useNestEditorContext must be used within a NestEditorProvider');
    }
    return context;
};

export { NestEditorContext };
export type { NestEditorContextType };
