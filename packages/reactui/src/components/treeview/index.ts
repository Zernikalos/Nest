/**
 * TreeView Component Library
 *
 * A fully-featured tree view component with keyboard navigation,
 * drag & drop, and custom rendering capabilities.
 *
 * @example
 * ```tsx
 * import { TreeView } from '@/components/treeview'
 *
 * <TreeView
 *   data={treeData}
 *   selectedIds={selectedIds}
 *   onSelect={setSelectedIds}
 *   onMove={setTreeData}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Using specialized hooks for custom implementations
 * import { useTreeNodeNavigation, useTreeNodeSelection } from '@/components/treeview'
 *
 * const navigation = useTreeNodeNavigation(node)
 * const selection = useTreeNodeSelection(node)
 * ```
 */

// Main component
export { TreeView } from './treeview';

// Context and hooks
export { TreeViewProvider, useTreeView } from './TreeViewContext';

// Specialized hooks for separation of concerns
export { useTreeNodeNavigation } from './hooks/useTreeNodeNavigation';
export { useTreeNodeSelection } from './hooks/useTreeNodeSelection';

// Individual components
export { TreeNodeItem } from './TreeNodeItem';

// Types
export type { TreeNode } from './TreeViewContext';
