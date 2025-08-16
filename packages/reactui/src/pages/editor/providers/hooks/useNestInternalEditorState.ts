import { useCallback } from 'react';
import type { TreeNode } from '@/components/treeview';
import { zernikalos } from '@/lib/zernikalos';
import { useTreeState } from './useTreeState';
import { useSelectionState } from './useSelectionState';
import { useTabsState } from './useTabsState';
import { useZObjectState } from './useZObjectState';

interface NestInternalEditorStateProps {
    root: zernikalos.objects.ZObject | undefined;
}

export interface NestInternalEditorState {
    // State
    tree: TreeNode[];
    selectedIds: string[];
    openedNodes: TreeNode[];
    activeNode: string | null;
    selectedZObject: zernikalos.objects.ZObject | null;
    
    // Actions
    handleSelect: (ids: string[]) => void;
    handleTabChange: (nodeId: string) => void;
    handleTabClose: (nodeId: string) => void;
    
    // Utils
    notifyChange: () => void;
}

export function useNestInternalEditorState({ root }: NestInternalEditorStateProps): NestInternalEditorState {
    const { tree, notifyChange } = useTreeState({ root });
    const { selectedIds, activeNode, handleSelect, setActiveNode } = useSelectionState({ tree });
    const { openedNodes, handleTabChange, handleTabClose, openedNodeIds, setOpenedNodeIds } = useTabsState({ tree });
    const { selectedZObject } = useZObjectState({ root, activeNode });

    // Wrapper for handleTabChange that also updates the activeNode
    const handleTabChangeWithActive = useCallback((nodeId: string) => {
        handleTabChange(nodeId);
        setActiveNode(nodeId);
    }, [handleTabChange, setActiveNode]);

    // Wrapper for handleTabClose that handles the activeNode logic
    const handleTabCloseWithActive = useCallback((nodeId: string) => {
        handleTabClose(nodeId);
        
        // Update active node if needed
        if (activeNode === nodeId) {
            const remainingIds = Array.from(openedNodeIds).filter(id => id !== nodeId);
            setActiveNode(remainingIds.length > 0 ? remainingIds[0] : null);
        }
    }, [handleTabClose, activeNode, openedNodeIds, setActiveNode]);

    // Wrapper for handleSelect that also opens the node
    const handleSelectWithOpen = useCallback((ids: string[]) => {
        handleSelect(ids);
        const nodeId = ids[ids.length - 1];
        if (nodeId && !openedNodeIds.has(nodeId)) {
            setOpenedNodeIds((prev: Set<string>) => new Set([...prev, nodeId]));
        }
    }, [handleSelect, openedNodeIds, setOpenedNodeIds]);

    return {
        tree,
        selectedIds,
        openedNodes,
        activeNode,
        selectedZObject,
        handleSelect: handleSelectWithOpen,
        handleTabChange: handleTabChangeWithActive,
        handleTabClose: handleTabCloseWithActive,
        notifyChange,
    };
} 