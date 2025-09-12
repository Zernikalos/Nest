import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useTreeView } from '../TreeViewContext';
import type { TreeNode } from '../TreeViewContext';

/**
 * Hook that handles keyboard navigation for a tree node
 * Separates navigation logic from rendering logic
 */
export function useTreeNodeNavigation(node: TreeNode) {
    const {
        currentFocusedNode,
        treeViewHasFocus,
        expandedIds,
        navigateToNext,
        navigateToPrev,
        navigateToParent,
        expandNode,
        collapseNode,
        toggleNode,
        selectNode,
    } = useTreeView();

    const isFocused = currentFocusedNode === node.id;
    const isExpanded = expandedIds.has(node.id);
    const hasChildren = !!node.children && node.children.length > 0;

    /**
     * Handles node expansion/collapse toggle
     */
    const handleToggle = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            toggleNode(node.id);
        },
        [node.id, toggleNode]
    );

    /**
     * Navigate to next visible node
     */
    const navigateNext = useCallback(() => {
        navigateToNext(node.id);
    }, [node.id, navigateToNext]);

    /**
     * Navigate to previous visible node
     */
    const navigatePrev = useCallback(() => {
        navigateToPrev(node.id);
    }, [node.id, navigateToPrev]);

    /**
     * Expand node or navigate to parent
     */
    const navigateRight = useCallback(() => {
        if (hasChildren && !isExpanded) {
            expandNode(node.id);
        }
    }, [hasChildren, isExpanded, node.id, expandNode]);

    /**
     * Collapse node or navigate to parent
     */
    const navigateLeft = useCallback(() => {
        if (hasChildren && isExpanded) {
            collapseNode(node.id);
        } else {
            // Go to parent
            navigateToParent(node.id);
        }
    }, [hasChildren, isExpanded, node.id, collapseNode, navigateToParent]);

    /**
     * Select the current node (Enter key)
     */
    const selectCurrentNode = useCallback(() => {
        selectNode(node.id);
    }, [node.id, selectNode]);

    // Keyboard navigation using react-hotkeys-hook
    // Only active when node is focused AND tree has focus
    useHotkeys(
        'arrowdown',
        (e: KeyboardEvent) => {
            e.preventDefault();
            navigateNext();
        },
        {
            enabled: isFocused && treeViewHasFocus,
            preventDefault: true,
            enableOnFormTags: false,
        },
        [isFocused, treeViewHasFocus, navigateNext]
    );

    useHotkeys(
        'arrowup',
        (e: KeyboardEvent) => {
            e.preventDefault();
            navigatePrev();
        },
        {
            enabled: isFocused && treeViewHasFocus,
            preventDefault: true,
            enableOnFormTags: false,
        },
        [isFocused, treeViewHasFocus, navigatePrev]
    );

    useHotkeys(
        'arrowright',
        (e: KeyboardEvent) => {
            e.preventDefault();
            navigateRight();
        },
        {
            enabled: isFocused && treeViewHasFocus,
            preventDefault: true,
            enableOnFormTags: false,
        },
        [isFocused, treeViewHasFocus, navigateRight]
    );

    useHotkeys(
        'arrowleft',
        (e: KeyboardEvent) => {
            e.preventDefault();
            navigateLeft();
        },
        {
            enabled: isFocused && treeViewHasFocus,
            preventDefault: true,
            enableOnFormTags: false,
        },
        [isFocused, treeViewHasFocus, navigateLeft]
    );

    useHotkeys(
        'enter',
        (e: KeyboardEvent) => {
            e.preventDefault();
            selectCurrentNode();
        },
        {
            enabled: isFocused && treeViewHasFocus,
            preventDefault: true,
            enableOnFormTags: false,
        },
        [isFocused, treeViewHasFocus, selectCurrentNode]
    );

    return {
        isFocused,
        isExpanded,
        hasChildren,
        handleToggle,
        navigateNext,
        navigatePrev,
        navigateRight,
        navigateLeft,
        selectCurrentNode,
    };
}
