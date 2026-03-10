import React, { type ReactNode, useEffect, useRef } from 'react';
import { NestEditorContext } from './NestEditorContext';
import { useZkoStore } from '@/stores/useZkoStore';
import { useAssetToZko } from '@/hooks/useAssetToZko';
import { useIdeCore } from '@/ideCore';
import { mapTreeToReact } from '@/ideCore';
import { OPEN_TAB, SET_ACTIVE_TAB } from '@zstudio/ide-core';
import { useZObjectState } from './hooks/useZObjectState';
import { editorLogger } from '../editorLogger';

interface NestEditorProviderInnerProps {
    children: ReactNode;
}

function collectTreeIds(nodes: { id: string; children?: { id: string; children?: unknown[] }[] }[]): Set<string> {
    const ids = new Set<string>();
    const collect = (n: { id: string; children?: unknown[] }[]) => {
        for (const node of n) {
            ids.add(node.id);
            if (node.children) collect(node.children as { id: string; children?: unknown[] }[]);
        }
    };
    collect(nodes);
    return ids;
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
        sessionSave,
        sessionRestore,
        dispatchSceneTree,
        getSceneTreeState,
    } = useIdeCore();
    const restoreAttemptedRef = useRef(false);

    const { selectedZObject } = useZObjectState({ root, activeNode: viewModel.activeNode });

    useEffect(() => {
        setTreeFromRoot(root);
    }, [root, setTreeFromRoot]);

    useEffect(() => {
        if (
            root &&
            viewModel.tree.length > 0 &&
            sessionRestore &&
            dispatchSceneTree &&
            !restoreAttemptedRef.current
        ) {
            restoreAttemptedRef.current = true;
            sessionRestore().then((data) => {
                if (data?.sceneTree) {
                    const { openedNodeIds, activeNode } = data.sceneTree;
                    const state = getSceneTreeState();
                    const treeIds = collectTreeIds(state.tree);
                    const validIds = openedNodeIds.filter((id) => treeIds.has(id));
                    for (const id of validIds) {
                        dispatchSceneTree({ type: OPEN_TAB, payload: id });
                    }
                    if (activeNode && treeIds.has(activeNode)) {
                        dispatchSceneTree({ type: SET_ACTIVE_TAB, payload: activeNode });
                    }
                }
            });
        }
        if (!root) {
            restoreAttemptedRef.current = false;
        }
    }, [root, viewModel.tree.length, sessionRestore, dispatchSceneTree, getSceneTreeState]);

    useEffect(() => {
        if (zkResult) {
            editorLogger.info('Editor project loaded', {
                filePath: zkResult.filePath,
            });
        }
    }, [zkResult?.filePath]);

    useEffect(() => {
        return () => {
            sessionSave?.();
        };
    }, [sessionSave]);

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
