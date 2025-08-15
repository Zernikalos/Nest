import { useState, useCallback, useMemo } from 'react';
import type { TreeNode } from '@/components/treeview';
import { zernikalos } from '@zernikalos/zernikalos';

interface NestEditorStateProps {
    root: zernikalos.objects.ZObject | undefined;
}

interface NestEditorState {
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
}

// Convert ZObject to TreeNode
function convertZObjectToTreeNode(zObject: zernikalos.objects.ZObject): TreeNode {
    return {
        id: zObject.refId,
        label: zObject.name,
        children: zObject.children?.map((child: any) => convertZObjectToTreeNode(child)) || []
    };
}

// Pure function to find TreeNode by id
function findNodeById(tree: TreeNode[], id: string): TreeNode | undefined {
    for (const node of tree) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return undefined;
}

// Pure function to find ZObject by refId
function findZObjectById(root: zernikalos.objects.ZObject, refId: string): zernikalos.objects.ZObject | null {
    if (root.refId === refId) return root;
    
    for (const child of root.children || []) {
        const found = findZObjectById(child, refId);
        if (found) return found;
    }
    
    return null;
}

export function useNestEditorState({ root }: NestEditorStateProps): NestEditorState {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openedNodeIds, setOpenedNodeIds] = useState<Set<string>>(new Set());
    const [activeNode, setActiveNode] = useState<string | null>(null);

    // Generate tree from root
    const tree = root ? [convertZObjectToTreeNode(root)] : [];

    // Derive selectedZObject from activeNode
    const selectedZObject = useMemo(() => {
        if (!activeNode || !root) return null;
        return findZObjectById(root, activeNode);
    }, [activeNode, root]);

    // Derive openedNodes from current tree and opened IDs
    const openedNodes = useMemo(() => {
        return Array.from(openedNodeIds)
            .map(id => findNodeById(tree, id))
            .filter((node): node is TreeNode => node !== undefined);
    }, [openedNodeIds, tree]);

    // Event handlers
    const handleSelect = useCallback((ids: string[]) => {
        setSelectedIds(ids);
        const node = findNodeById(tree, ids[ids.length - 1]);
        if (node) {
            // Add to opened nodes if not already open
            setOpenedNodeIds(prev => new Set([...prev, node.id]));
            setActiveNode(node.id);
        }
    }, [tree]);

    const handleTabChange = useCallback((nodeId: string) => {
        setActiveNode(nodeId);
    }, []);

    const handleTabClose = useCallback((nodeId: string) => {
        setOpenedNodeIds(prev => {
            const next = new Set(prev);
            next.delete(nodeId);
            return next;
        });
        
        // Update active node if needed
        if (activeNode === nodeId) {
            const remainingIds = Array.from(openedNodeIds).filter(id => id !== nodeId);
            setActiveNode(remainingIds.length > 0 ? remainingIds[0] : null);
        }
    }, [activeNode, openedNodeIds]);

    return {
        tree,
        selectedIds,
        openedNodes,
        activeNode,
        selectedZObject,
        handleSelect,
        handleTabChange,
        handleTabClose,
    };
} 