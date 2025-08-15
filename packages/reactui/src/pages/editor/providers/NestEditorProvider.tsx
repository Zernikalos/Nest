import React, { type ReactNode } from 'react';
import { NestEditorContext } from './NestEditorContext';
import { useZkProjectStore } from '@/stores';
import { useNestInternalEditorState } from './hooks';

interface NestEditorProviderProps {
    children: ReactNode;
}

export const NestEditorProvider: React.FC<NestEditorProviderProps> = ({ 
    children
}) => {
    const zkResult = useZkProjectStore(state => state.zkResult);
    const root = zkResult?.zko?.root;
    const editorState = useNestInternalEditorState({ root });

    const contextValue = {
        ...editorState,
        zkResult,
    };

    return (
        <NestEditorContext.Provider value={contextValue}>
            {children}
        </NestEditorContext.Provider>
    );
};
