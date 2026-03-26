import React, { type ReactNode, useEffect } from 'react';
import { NestEditorContext } from './NestEditorContext';
import { useZkoStore } from '@/stores/useZkoStore';
import { useAssetToZko } from '@/hooks/useAssetToZko';
import { useIdeCore } from '@/ideCore';
import { mapTreeToReact } from '@/ideCore';
import { useZObjectState } from './hooks/useZObjectState';
import { editorLogger } from '../editorLogger';

interface NestEditorProviderInnerProps {
    children: ReactNode;
}

function NestEditorProviderInner({ children }: NestEditorProviderInnerProps) {
    const zkResult = useZkoStore((state) => state.zkResult);
    const { regenerateZko } = useAssetToZko();
    const root = zkResult?.zko?.root;
    const {
        viewModel,
        handleSelect,
        handleTabChange,
        handleTabClose,
        setTreeFromRoot,
    } = useIdeCore();

    const { selectedZObject } = useZObjectState({ root, activeNode: viewModel.activeNode });

    useEffect(() => {
        setTreeFromRoot(root);
    }, [root, setTreeFromRoot]);

    useEffect(() => {
        if (zkResult) {
            editorLogger.info('Editor project loaded', {
                filePath: zkResult.filePath,
            });
        }
    }, [zkResult?.filePath]);

    const notifyChange = () => {
        setTreeFromRoot(root);
    };

    const contextValue = {
        tree: mapTreeToReact(viewModel.tree),
        selectedIds: viewModel.selectedIds,
        openedNodes: mapTreeToReact(viewModel.openedNodes),
        activeNode: viewModel.activeNode,
        selectedZObject,
        handleSelect,
        handleTabChange,
        handleTabClose,
        notifyChange,
        zkResult,
        regenerateZko,
    };

    return (
        <NestEditorContext.Provider value={contextValue}>
            {children}
        </NestEditorContext.Provider>
    );
}

interface NestEditorProviderProps {
    children: ReactNode;
}

export const NestEditorProvider: React.FC<NestEditorProviderProps> = ({ children }) => {
    return <NestEditorProviderInner>{children}</NestEditorProviderInner>;
};
