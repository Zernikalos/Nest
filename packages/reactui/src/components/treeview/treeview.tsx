import React from 'react';

import { TreeNodeItem } from './TreeNodeItem';
import { TreeViewProvider, useTreeView } from './TreeViewContext';
import type { TreeNode } from './TreeViewContext';

/**
 * CSS classes for the TreeView component
 */
const styles = {
    /** Main container styles */
    container: 'flex flex-col select-none',
} as const;

/**
 * Props for the TreeView component
 */
export interface TreeViewProps {
    /** Tree data structure */
    data: TreeNode[];
    /** Currently selected node IDs */
    selectedIds: string[];
    /** Callback when selection changes */
    onSelect: (selected: string[]) => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Internal component that renders the tree content
 */
function TreeViewContent({
    data,
    className,
}: {
    data: TreeNode[];
    className?: string;
}) {
    // Ref for the tree container to manage focus
    const treeRef = React.useRef<HTMLDivElement>(null);
    const { setTreeViewHasFocus, treeContainerRef } = useTreeView();

    // Sync the ref with the context
    React.useEffect(() => {
        if (treeRef.current && treeContainerRef) {
            treeContainerRef.current = treeRef.current;
        }
    }, [treeContainerRef]);

    /**
     * Recursively renders tree nodes
     */
    const renderNodes = React.useCallback(
        (nodes: TreeNode[], depth: number) => (
            <>
                {nodes.map(node => (
                    <TreeNodeItem
                        key={node.id}
                        node={node}
                        depth={depth}
                        renderChildren={renderNodes}
                    />
                ))}
            </>
        ),
        []
    );

    return (
        <div
            ref={treeRef}
            className={`${styles.container} ${className || ''}`}
            tabIndex={0}
            onFocus={() => setTreeViewHasFocus(true)}
            onBlur={e => {
                // Only blur if focus is not moving to a child element
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setTreeViewHasFocus(false);
                }
            }}
        >
            {renderNodes(data, 0)}
        </div>
    );
}

/**
 * TreeView component with keyboard navigation and custom rendering support
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Space)
 * - Multi-select support (Ctrl/Cmd + Click)
 * - Custom label rendering
 * - Focus management
 * - Expand/collapse functionality
 */
export const TreeView: React.FC<TreeViewProps> = ({
    data,
    selectedIds,
    onSelect,
    className,
}) => {
    return (
        <TreeViewProvider
            data={data}
            selectedIds={selectedIds}
            onSelect={onSelect}
        >
            <TreeViewContent 
                data={data} 
                className={className}
            />
        </TreeViewProvider>
    );
};

TreeView.displayName = 'TreeView';
