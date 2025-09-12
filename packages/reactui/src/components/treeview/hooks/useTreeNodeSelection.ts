import { useCallback } from 'react';

import { useTreeView } from '../TreeViewContext';
import type { TreeNode } from '../TreeViewContext';

/**
 * Hook that handles selection logic for a tree node
 * Separates selection logic from rendering logic
 */
export function useTreeNodeSelection(node: TreeNode) {
    const { 
        selectedIds, 
        setCurrentFocusedNode,
        selectNode,
        toggleNodeSelection,
        toggleNode,
    } = useTreeView();

    const isSelected = selectedIds.includes(node.id);
    const hasChildren = !!node.children && node.children.length > 0;

    /**
     * Handles node selection and focus
     * Supports single and multi-select (Ctrl/Cmd + Click)
     */
    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            // Set focus first
            setCurrentFocusedNode(node.id);

            if (e.metaKey || e.ctrlKey) {
                // Multi-select: toggle current node
                toggleNodeSelection(node.id);
            } else {
                // Single select: select only this node
                selectNode(node.id);
            }
        },
        [node.id, setCurrentFocusedNode, toggleNodeSelection, selectNode]
    );

    /**
     * Handles double-click to expand/collapse nodes with children
     */
    const handleDoubleClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (hasChildren) {
                // Toggle expansion on double-click for nodes with children
                toggleNode(node.id);
            }
        },
        [hasChildren, node.id, toggleNode]
    );

    /**
     * Selects the node programmatically
     */
    const selectNodeProgrammatically = useCallback(() => {
        setCurrentFocusedNode(node.id);
        selectNode(node.id);
    }, [node.id, setCurrentFocusedNode, selectNode]);

    /**
     * Toggles selection of the node (for multi-select)
     */
    const toggleSelection = useCallback(() => {
        setCurrentFocusedNode(node.id);
        toggleNodeSelection(node.id);
    }, [node.id, setCurrentFocusedNode, toggleNodeSelection]);

    return {
        isSelected,
        hasChildren,
        handleClick,
        handleDoubleClick,
        selectNode: selectNodeProgrammatically,
        toggleSelection,
    };
}
