import { useState, useCallback } from 'react';
import type { TreeNode } from '@/components/treeview';
import { findNodeById } from './utils';

interface UseSelectionStateProps {
    tree: TreeNode[];
}

export function useSelectionState({ tree }: UseSelectionStateProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeNode, setActiveNode] = useState<string | null>(null);

    const handleSelect = useCallback((ids: string[]) => {
        setSelectedIds(ids);
        const node = findNodeById(tree, ids[ids.length - 1]);
        if (node) {
            setActiveNode(node.id);
        }
    }, [tree]);

    return { 
        selectedIds, 
        activeNode, 
        handleSelect, 
        setActiveNode 
    };
}
