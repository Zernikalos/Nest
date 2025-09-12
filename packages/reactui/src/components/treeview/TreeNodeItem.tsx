import { ChevronDown, ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import { useTreeNodeNavigation } from './hooks/useTreeNodeNavigation';
import { useTreeNodeSelection } from './hooks/useTreeNodeSelection';
import { useTreeView } from './TreeViewContext';

/**
 * CSS classes organized by component state for better maintainability
 */
const styles = {
    // Tree node item container
    nodeItem: 'flex flex-col',

    // Tree node container
    treeNode: cn(
        // Positioning and layout
        'flex items-center gap-1 px-1 py-0.5 w-full h-8',
        // Interactive states
        'cursor-pointer hover:bg-base-200 focus:outline-none'
    ),

    // State variants
    selected: 'bg-base-100 text-base-foreground',
    focused: 'bg-base-200 text-base-foreground',

    // Toggle button
    toggleButton: 'mr-1 p-0.5 rounded hover:bg-base-200',

    // Spacer for items without children
    spacer: 'w-5',

    // Label text
    labelText: 'flex-1 overflow-hidden',

    // Children container
    childrenContainer: 'flex flex-col',
} as const;

/**
 * Represents a node in the tree structure
 */
export interface TreeNode {
    /** Unique identifier for the node */
    id: string;
    /** Display text for the node */
    label: string;
    /** Optional icon component to display */
    icon?: React.ReactNode;
    /** Optional child nodes */
    children?: TreeNode[];
}

/**
 * Props for the TreeNodeItem component
 */
interface TreeNodeItemProps {
    /** The node data to render */
    node: TreeNode;
    /** Depth level in the tree (0 = root) */
    depth?: number;
    /** Function to render child nodes */
    renderChildren: (children: TreeNode[], depth: number) => React.ReactNode;
}

/**
 * Renders a single tree node with separated concerns using specialized hooks
 * - Navigation logic handled by useTreeNodeNavigation
 * - Selection logic handled by useTreeNodeSelection
 * - Rendering logic handled by useTreeNodeRenderer
 */
export function TreeNodeItem({
    node,
    depth = 0,
    renderChildren,
}: TreeNodeItemProps) {
    // Use specialized hooks for different concerns
    const navigation = useTreeNodeNavigation(node);
    const selection = useTreeNodeSelection(node);

    const { isSelected, handleClick, handleDoubleClick } = selection;
    const { isExpanded, hasChildren, handleToggle } = navigation;

    // Get state from context directly
    const { currentFocusedNode, setCurrentFocusedNode } = useTreeView();
    const isFocused = currentFocusedNode === node.id;

    // Simple focus handler
    const handleFocus = () => setCurrentFocusedNode(node.id);

    const paddingLeft = depth * 16;

    // Create default label with proper styling using cn
    const defaultLabel = (
        <div
            style={{ paddingLeft: paddingLeft }}
            className={cn(
                styles.treeNode,
                isSelected && styles.selected,
                isFocused && styles.focused
            )}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onFocus={handleFocus}
            tabIndex={0}
        >
            {hasChildren ? (
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={handleToggle}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    tabIndex={-1}
                >
                    {isExpanded ? (
                        <ChevronDown size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>
            ) : (
                <span className={styles.spacer} />
            )}
            {node.icon && (
                <span className="mr-2 flex-shrink-0">
                    {node.icon}
                </span>
            )}
            <span className={styles.labelText}>{node.label}</span>
        </div>
    );

    return (
        <div
            className={styles.nodeItem}
            data-node-id={node.id}
        >
            {defaultLabel}
            {hasChildren && isExpanded && (
                <div className={styles.childrenContainer}>
                    {renderChildren(node.children!, depth + 1)}
                </div>
            )}
        </div>
    );
}

TreeNodeItem.displayName = 'TreeNodeItem';
