import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useRef,
    useCallback,
} from 'react';

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
 * State and methods provided by the TreeView context
 */
interface TreeViewState {
    /** Currently focused node ID */
    currentFocusedNode: string | null;
    /** Function to set the focused node */
    setCurrentFocusedNode: (id: string | null) => void;

    /** Whether the tree container has focus */
    treeViewHasFocus: boolean;
    /** Function to set tree container focus */
    setTreeViewHasFocus: (hasFocus: boolean) => void;

    /** Tree container ref for keyboard event targeting */
    treeContainerRef: React.RefObject<HTMLDivElement> | null;

    /** Set of expanded node IDs */
    expandedIds: Set<string>;
    /** Function to update expanded nodes */
    setExpandedIds: (ids: Set<string>) => void;

    /** Array of selected node IDs */
    selectedIds: string[];
    /** Function to update selected nodes */
    setSelectedIds: (ids: string[]) => void;

    /** Flat list of visible nodes for keyboard navigation */
    visibleNodes: TreeNode[];

    /** Helper function to find parent of a node */
    findParentNode: (nodeId: string) => TreeNode | null;

    /** Navigation methods */
    navigateToNext: (currentNodeId: string) => void;
    navigateToPrev: (currentNodeId: string) => void;
    navigateToParent: (currentNodeId: string) => void;

    /** Expansion methods */
    expandNode: (nodeId: string) => void;
    collapseNode: (nodeId: string) => void;
    toggleNode: (nodeId: string) => void;

    /** Selection methods */
    selectNode: (nodeId: string) => void;
    toggleNodeSelection: (nodeId: string) => void;
    selectMultiple: (nodeIds: string[]) => void;
    clearSelection: () => void;

    /** Callback when selection changes */
    onSelect: (selected: string[]) => void;
}

/**
 * React context for TreeView state management
 */
const TreeViewContext = createContext<TreeViewState | null>(null);

/**
 * Recursively builds a flat list of visible nodes for keyboard navigation
 * @param nodes - Array of nodes to process
 * @param expandedIds - Set of expanded node IDs
 * @returns Flat array of visible nodes
 */
function getVisibleNodes(
    nodes: TreeNode[],
    expandedIds: Set<string>
): TreeNode[] {
    const visible: TreeNode[] = [];

    function traverse(nodes: TreeNode[]) {
        for (const node of nodes) {
            visible.push(node);
            if (node.children && expandedIds.has(node.id)) {
                traverse(node.children);
            }
        }
    }

    traverse(nodes);
    return visible;
}

/**
 * Recursively finds the parent node of a given node ID
 * @param nodeId - ID of the node to find parent for
 * @param nodes - Array of nodes to search in
 * @returns Parent node or null if not found
 */
function findParentNode(nodeId: string, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
        if (node.children) {
            if (node.children.some(child => child.id === nodeId)) {
                return node;
            }
            const found = findParentNode(nodeId, node.children);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Props for the TreeViewProvider component
 */
interface TreeViewProviderProps {
    /** React children to wrap */
    children: React.ReactNode;
    /** Tree data structure */
    data: TreeNode[];
    /** Currently selected node IDs */
    selectedIds: string[];
    /** Callback when selection changes */
    onSelect: (selected: string[]) => void;
}

/**
 * Provider component that manages TreeView state and provides context
 * to all child components
 */
export function TreeViewProvider({
    children,
    data,
    selectedIds,
    onSelect,
}: TreeViewProviderProps) {
    const [currentFocusedNode, setCurrentFocusedNode] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [treeViewHasFocus, setTreeViewHasFocus] = useState(false);
    const treeContainerRef = useRef<HTMLDivElement>(
        null
    ) as React.RefObject<HTMLDivElement>;

    // Calculate visible nodes whenever data or expandedIds change
    const visibleNodes = useMemo(
        () => getVisibleNodes(data, expandedIds),
        [data, expandedIds]
    );

    // Navigation methods
    const navigateToNext = useCallback((currentNodeId: string) => {
        const currentIndex = visibleNodes.findIndex(n => n.id === currentNodeId);
        if (currentIndex >= 0 && currentIndex < visibleNodes.length - 1) {
            setCurrentFocusedNode(visibleNodes[currentIndex + 1].id);
        }
    }, [visibleNodes, setCurrentFocusedNode]);

    const navigateToPrev = useCallback((currentNodeId: string) => {
        const currentIndex = visibleNodes.findIndex(n => n.id === currentNodeId);
        if (currentIndex > 0) {
            setCurrentFocusedNode(visibleNodes[currentIndex - 1].id);
        }
    }, [visibleNodes, setCurrentFocusedNode]);

    const navigateToParent = useCallback((currentNodeId: string) => {
        const parent = findParentNode(currentNodeId, data);
        if (parent) {
            setCurrentFocusedNode(parent.id);
        }
    }, [data, setCurrentFocusedNode]);

    // Expansion methods
    const expandNode = useCallback((nodeId: string) => {
        const next = new Set(expandedIds);
        next.add(nodeId);
        setExpandedIds(next);
    }, [expandedIds, setExpandedIds]);

    const collapseNode = useCallback((nodeId: string) => {
        const next = new Set(expandedIds);
        next.delete(nodeId);
        setExpandedIds(next);
    }, [expandedIds, setExpandedIds]);

    const toggleNode = useCallback((nodeId: string) => {
        const next = new Set(expandedIds);
        if (next.has(nodeId)) {
            next.delete(nodeId);
        } else {
            next.add(nodeId);
        }
        setExpandedIds(next);
    }, [expandedIds, setExpandedIds]);

    // Selection methods
    const selectNode = useCallback((nodeId: string) => {
        onSelect([nodeId]);
    }, [onSelect]);

    const toggleNodeSelection = useCallback((nodeId: string) => {
        const next = new Set(selectedIds);
        if (next.has(nodeId)) {
            next.delete(nodeId);
        } else {
            next.add(nodeId);
        }
        onSelect(Array.from(next));
    }, [selectedIds, onSelect]);

    const selectMultiple = useCallback((nodeIds: string[]) => {
        onSelect(nodeIds);
    }, [onSelect]);

    const clearSelection = useCallback(() => {
        onSelect([]);
    }, [onSelect]);

    const value: TreeViewState = {
        currentFocusedNode,
        setCurrentFocusedNode,
        treeViewHasFocus,
        setTreeViewHasFocus,
        treeContainerRef,
        expandedIds,
        setExpandedIds,
        selectedIds,
        setSelectedIds: onSelect,
        visibleNodes,
        findParentNode: (nodeId: string) => findParentNode(nodeId, data),
        navigateToNext,
        navigateToPrev,
        navigateToParent,
        expandNode,
        collapseNode,
        toggleNode,
        selectNode,
        toggleNodeSelection,
        selectMultiple,
        clearSelection,
        onSelect,
    };

    return (
        <TreeViewContext.Provider value={value}>
            {children}
        </TreeViewContext.Provider>
    );
}

/**
 * Custom hook to access TreeView context
 * @throws Error if used outside of TreeViewProvider
 * @returns TreeView state and methods
 */
export function useTreeView() {
    const context = useContext(TreeViewContext);
    if (!context) {
        throw new Error('useTreeView must be used within a TreeViewProvider');
    }
    return context;
}

// Export helper functions for external use
export { getVisibleNodes, findParentNode };
