# TreeView Component Documentation

## Overview

The TreeView component is a fully-featured tree view implementation with keyboard navigation, selection management, and custom rendering capabilities. It uses React Context for state management and specialized hooks for separation of concerns.

## Architecture

### Core Files Structure

```
src/components/treeview/
├── TreeViewContext.tsx      # State management and context
├── treeview.tsx            # Main component with focus management
├── TreeNodeItem.tsx        # Individual node component
├── hooks/
│   ├── useTreeNodeNavigation.ts  # Keyboard navigation logic
│   └── useTreeNodeSelection.ts   # Selection logic
└── index.ts                # Exports
```

### State Management

The component uses React Context (`TreeViewContext`) to manage:

- **Focus state**: `currentFocusedNode` (currently focused node)
- **Selection state**: `selectedIds` (array of selected nodes)
- **Expansion state**: `expandedIds` (Set of expanded node IDs)
- **Tree focus**: `treeViewHasFocus` (whether the TreeView container has focus)
- **Visible nodes**: Computed list for keyboard navigation
- **Tree container ref**: For keyboard event targeting

### Key Interfaces

```typescript
interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
}

interface TreeViewProps {
    data: TreeNode[];
    selectedIds: string[];
    onSelect: (selected: string[]) => void;
    className?: string;
}
```

## Specialized Hooks

### useTreeNodeNavigation

Handles keyboard navigation and expansion logic:

- Arrow keys navigation between visible nodes
- Expand/collapse nodes with arrow keys
- Parent navigation when collapsing
- Only active when node is focused AND tree has focus
- Uses `react-hotkeys-hook` for keyboard event handling

### useTreeNodeSelection

Manages selection logic:

- Single and multi-select (Ctrl/Cmd + Click)
- Focus management
- Click and double-click handlers
- Programmatic selection methods

## Focus Management

The component uses manual focus management:

- TreeView container is focusable (`tabIndex={0}`)
- Focus state tracked via `treeViewHasFocus`
- Keyboard events only work when TreeView has focus
- Focus/blur handlers manage tree focus state

## Keyboard Navigation

### Supported Keys

- **Arrow Down**: Navigate to next visible node
- **Arrow Up**: Navigate to previous visible node
- **Arrow Right**: Expand node (if has children)
- **Arrow Left**: Collapse node or navigate to parent

### Focus Conditions

Navigation only works when:

1. TreeView container has focus (`treeViewHasFocus = true`)
2. A specific node is focused (`currentFocusedNode` exists)

## Visual States

### Node States

- **Normal**: Default styling
- **Selected**: `bg-accent text-accent-foreground` (blue background)
- **Focused**: `bg-muted text-muted-foreground` (gray background)
- **Selected + Focused**: Selected styling takes precedence

### State Priority

1. Selected state (highest priority)
2. Focused state
3. Normal state

## Usage Patterns

### Basic Usage

```tsx
import { TreeView } from '@/components/treeview';

<TreeView
    data={treeData}
    selectedIds={selectedIds}
    onSelect={setSelectedIds}
/>;
```

### Using Specialized Hooks

```tsx
import {
    useTreeNodeNavigation,
    useTreeNodeSelection,
} from '@/components/treeview';

function CustomTreeNode({ node }) {
    const navigation = useTreeNodeNavigation(node);
    const selection = useTreeNodeSelection(node);

    // Use navigation.isExpanded, selection.isSelected, etc.
}
```

## Context Usage

### Accessing TreeView State

```tsx
import { useTreeView } from '@/components/treeview';

function MyComponent() {
    const {
        currentFocusedNode,
        selectedIds,
        expandedIds,
        treeViewHasFocus,
        visibleNodes,
        setCurrentFocusedNode,
        setSelectedIds,
        setExpandedIds,
        findParentNode,
    } = useTreeView();
}
```

### State Updates

- Use `setCurrentFocusedNode(id)` to change focus
- Use `setSelectedIds(ids)` to update selection
- Use `setExpandedIds(set)` to update expansion
- Use `setTreeViewHasFocus(boolean)` to control tree focus

## Performance Considerations

### Memoization

- `visibleNodes` are memoized based on `data` and `expandedIds`
- Navigation functions are memoized with `useCallback`
- Selection handlers are memoized with `useCallback`

### Re-render Optimization

- Each `TreeNodeItem` manages its own state through hooks
- Context updates only affect components that use specific state
- Focus management is isolated to prevent unnecessary re-renders

## Common Patterns

### Adding New Keyboard Shortcuts

1. Add new function in `useTreeNodeNavigation`
2. Add `useHotkeys` call with proper conditions
3. Ensure it only works when `treeViewHasFocus && currentFocusedNode`

### Custom Node Interactions

1. Use `useTreeNodeSelection` for click handling
2. Access context directly for complex state management
3. Use memoized callbacks for performance

### State Synchronization

- All state is managed through the Context
- Use `setSelectedIds`, `setExpandedIds`, etc. for updates
- Avoid direct state mutations
- Use `getState()` for debugging

## Error Handling

### Context Usage

- Always wrap TreeView with `TreeViewProvider`
- Check for context existence before using hooks
- Provide fallbacks for missing state

### Focus Management

- Manual focus management with proper cleanup
- Focus/blur handlers for tree container
- Cleanup event listeners properly

## Testing Considerations

### Hook Testing

- Test each specialized hook independently
- Mock context values for isolated testing
- Test focus conditions thoroughly

### Integration Testing

- Test keyboard navigation flow
- Test focus transitions
- Test selection interactions
- Test custom renderers

## Extension Points

### Adding New Features

1. **New State**: Add to `TreeViewState` interface
2. **New Hooks**: Create in `hooks/` directory
3. **New Events**: Add to appropriate hook
4. **New UI**: Extend `TreeNodeItem` or create custom renderer

### Customization

- Extend `TreeNode` interface for additional data
- Override default styles with CSS classes
- Add new keyboard shortcuts through hooks
- Create custom node renderers

## Best Practices

### State Management

- Keep state in Context for shared access
- Use specialized hooks for component logic
- Avoid prop drilling
- Memoize expensive computations

### Performance

- Use `React.memo` for expensive components
- Memoize callbacks with `useCallback`
- Memoize computed values with `useMemo`
- Clean up event listeners properly

### Accessibility

- Maintain keyboard navigation
- Provide ARIA labels
- Support screen readers
- Handle focus management properly

## Key Differences from Previous Version

### Removed Features
- Drag & drop functionality (no longer present)
- `onMove` callback (removed from interface)
- `renderLabel` prop (simplified to default rendering)
- `useTreeNodeRenderer` hook (functionality merged into `TreeNodeItem`)

### Updated Interfaces
- `focusedId` → `currentFocusedNode`
- `hasFocus` → `treeViewHasFocus`
- `treeContainerRef` added for keyboard event targeting
- Simplified `TreeViewProps` interface

### Updated Architecture
- Removed `FocusTrap` dependency
- Manual focus management instead of `focus-trap-react`
- Simplified component structure
- More direct state management through context

### Updated Hooks
- `useTreeNodeNavigation` now uses `react-hotkeys-hook`
- `useTreeNodeSelection` includes programmatic selection methods
- Removed `useTreeNodeRenderer` hook
- Enhanced focus and selection logic
