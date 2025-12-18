import React, { type ReactNode } from 'react';
import { NestEditorContext } from './NestEditorContext';
import { useZkoStore } from '@/stores/useZkoStore';
import { useAssetToZko } from '@/hooks/useAssetToZko';
import { useNestInternalEditorState } from './hooks';

interface NestEditorProviderProps {
    children: ReactNode;
}

export const NestEditorProvider: React.FC<NestEditorProviderProps> = ({ 
    children
}) => {
    const zkResult = useZkoStore(state => state.zkResult);
    const { regenerateZko } = useAssetToZko();
    const root = zkResult?.zko?.root;
    const editorState = useNestInternalEditorState({ root });

    const contextValue = {
        ...editorState,
        zkResult,
        rebuildZkResult: regenerateZko,
    };

    return (
        <NestEditorContext.Provider value={contextValue}>
            {children}
        </NestEditorContext.Provider>
    );
};
