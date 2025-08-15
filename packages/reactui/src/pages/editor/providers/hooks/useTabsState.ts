import { useState, useMemo, useCallback } from 'react';
import type { TreeNode } from '@/components/treeview';
import { findNodeById } from './utils';

interface UseTabsStateProps {
    tree: TreeNode[];
}

export function useTabsState({ tree }: UseTabsStateProps) {
    const [openedNodeIds, setOpenedNodeIds] = useState<Set<string>>(new Set());

    const openedNodes = useMemo(() => {
        return Array.from(openedNodeIds)
            .map(id => findNodeById(tree, id))
            .filter((node): node is TreeNode => node !== undefined);
    }, [openedNodeIds, tree]);

    const handleTabChange = useCallback((nodeId: string) => {
        // Add to opened nodes if not already open
        setOpenedNodeIds(prev => new Set([...prev, nodeId]));
    }, []);

    const handleTabClose = useCallback((nodeId: string) => {
        setOpenedNodeIds(prev => {
            const next = new Set(prev);
            next.delete(nodeId);
            return next;
        });
    }, []);

    return { 
        openedNodes, 
        handleTabChange, 
        handleTabClose,
        openedNodeIds,
        setOpenedNodeIds
    };
}
