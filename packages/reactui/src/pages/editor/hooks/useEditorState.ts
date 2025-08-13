import { useState, useCallback } from 'react';
import type { TreeNode } from '@/components/treeview';

interface UseEditorStateProps {
    tree: TreeNode[];
}

interface UseEditorStateReturn {
    // State
    selectedIds: string[];
    openedNodes: TreeNode[];
    activeNode: string | null;
    
    // Actions
    handleSelect: (ids: string[]) => void;
    handleTabChange: (nodeId: string) => void;
    handleTabClose: (nodeId: string) => void;
}

export function useEditorState({ tree }: UseEditorStateProps): UseEditorStateReturn {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openedNodes, setOpenedNodes] = useState<TreeNode[]>([]);
    const [activeNode, setActiveNode] = useState<string | null>(null);

    // Find TreeNode by id
    const findNodeById = useCallback((tree: TreeNode[], id?: string): TreeNode | undefined => {
        if (!id) return undefined;
        for (const node of tree) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return undefined;
    }, [tree]);

    // Event handlers
    const handleSelect = useCallback((ids: string[]) => {
        setSelectedIds(ids);
        const node = findNodeById(tree, ids[ids.length - 1]);
        if (node) {
            // Add to opened nodes if not already open
            setOpenedNodes(prev => {
                if (!prev.find(n => n.id === node.id)) {
                    return [...prev, node];
                }
                return prev;
            });
            setActiveNode(node.id);
        }
    }, [tree, findNodeById]);

    const handleTabChange = useCallback((nodeId: string) => {
        setActiveNode(nodeId);
    }, []);

    const handleTabClose = useCallback((nodeId: string) => {
        setOpenedNodes(prev => {
            const newOpenedNodes = prev.filter(n => n.id !== nodeId);
            
            // Update active node if needed
            if (activeNode === nodeId) {
                const newActiveNode = newOpenedNodes.length > 0
                    ? newOpenedNodes[0]?.id
                    : null;
                setActiveNode(newActiveNode || null);
            }
            
            return newOpenedNodes;
        });
    }, [activeNode]);



    return {
        selectedIds,
        openedNodes,
        activeNode,
        handleSelect,
        handleTabChange,
        handleTabClose,
    };
} 