# Editor Page Documentation

## Overview

The Editor Page is the main interface of Zernikalos Studio, providing a comprehensive 3D editing environment. It consists of a tree view for object hierarchy and a main editing area with tabs and different view modes.

## Location
- **Main Component**: `src/pages/editor/EditorPage.tsx`
- **Layout**: `src/pages/editor/EditorLayout.tsx`
- **Top Bar**: `src/pages/editor/EditorTopBar.tsx`
- **Main Panel**: `src/pages/editor/EditorMainPanel.tsx`
- **Form View**: `src/pages/editor/EditorForm/EditorForm.tsx`
- **Code View**: `src/pages/editor/EditorCode/EditorCode.tsx`
- **Viewer**: `src/pages/editor/EditorViewer/EditorViewer.tsx`
- **New Project**: `src/pages/editor/NewProject.tsx`
- **Forms**: `src/pages/editor/forms/FormZObject.tsx`
- **Providers**: `src/pages/editor/providers/`

## Page Structure

### Main Components
```
EditorPage
└── NestEditorProvider
    └── EditorLayout
        ├── TreeView (left panel - 25% width)
        └── Right Panel (75% width)
            ├── EditorTopBar (tabs and view toggle)
            └── EditorMainPanel
                ├── EditorForm (form view)
                ├── EditorCode (code view)
                └── EditorViewer (viewer view)
```

### Layout System
- **Resizable Panels**: Uses `ResizablePanelGroup` for adjustable layout
- **Left Panel**: Tree view with project hierarchy (25% default)
- **Right Panel**: Main editing area with tabs (75% default)
- **Responsive**: Panels can be resized by user

## Core Functionality

### Project Management
- **New Project State**: Shows `NewProject` component when no project is loaded
- **Project Active State**: Switches to `EditorView` when project is loaded
- **State Management**: Uses local state for project activation

### Tree View Integration
- **Data Source**: Connected to `useZkoStore` for ZKO data
- **Tree Conversion**: Converts Zernikalos objects to TreeView format
- **Selection Management**: Handles node selection and tree updates

### Editing Interface
- **Tab System**: Multiple tabs for different objects
- **View Modes**: Form, Code, and Viewer view options
- **Object Editing**: Direct editing of Zernikalos objects
- **3D Viewer**: Integrated Zernikalos viewer for 3D preview

## State Management

### Local State
- **activeView**: Current view mode ('form' | 'code' | 'viewer')

### Store Integration
- **useZkoStore**: Current ZKO data and conversion state
- **useProjectStore**: Project metadata and identification
- **useNestEditorContext**: Custom context hook for editor-specific state
- **NestEditorProvider**: Context provider that wraps the editor interface

### State Updates
- **Tree Updates**: Triggered when object names change
- **View Changes**: Managed through local state
- **Selection Changes**: Handled by TreeView component

## Key Features

### Object Hierarchy
- **Tree Structure**: Hierarchical view of all project objects
- **Object Properties**: Editable names and properties
- **Child Relationships**: Parent-child object relationships

### Multi-Tab Editing
- **Tab Management**: Multiple objects can be open simultaneously
- **Tab Switching**: Active tab determines current editing context
- **Tab Closing**: Individual tabs can be closed

### View Modes
- **Form View**: Property editing interface with form controls
- **Code View**: Code-based editing with text editor
- **Viewer View**: 3D visualization of the Zernikalos scene

## Data Flow

### Project Loading
```
useZkoStore → zkResult → TreeView data → EditorView
```

### Object Selection
```
TreeView selection → activeNode → selectedZObject → EditorMainPanel → (EditorForm | EditorCode | EditorViewer)
```

### Object Updates
```
User input → handleNameChange → object update → tree refresh
```

## Code Standards

All components in the editor module follow the project's coding standards and best practices. For detailed information about export/import patterns, component architecture, and other standards, see:

**📋 [Coding Standards & Best Practices](../coding-standards.md)**

Key points for the editor module:
- **Named Exports**: All components use named exports (no default exports)
- **TypeScript**: Strict typing with proper interfaces
- **Component Architecture**: Consistent structure and patterns
- **Context Pattern**: Provider/Consumer pattern for state management

## Component Integration

### TreeView Component
- **Purpose**: Display object hierarchy
- **Data**: Converted from Zernikalos objects
- **Selection**: Integrated with editor state

### EditorTopBar
- **Purpose**: Tab management interface and view mode toggle
- **Features**: Tab switching, closing, view mode selection (form/code/viewer)
- **State**: Connected to editor state hooks
- **Location**: `src/pages/editor/EditorTopBar.tsx`

### EditorMainPanel
- **Purpose**: Main editing interface container
- **Features**: Switches between form, code, and viewer views based on activeView
- **Components**: Renders EditorForm, EditorCode, or EditorViewer conditionally
- **Location**: `src/pages/editor/EditorMainPanel.tsx`

### EditorForm
- **Purpose**: Property editing interface
- **Features**: Form-based editing of ZObject properties
- **Empty States**: Shows appropriate messages when no project/object is selected
- **Location**: `src/pages/editor/EditorForm/EditorForm.tsx`

### EditorCode
- **Purpose**: Code-based editing interface
- **Features**: Text editor for ZObject code representation
- **Location**: `src/pages/editor/EditorCode/EditorCode.tsx`

### EditorViewer
- **Purpose**: 3D visualization of the Zernikalos scene
- **Features**: Integrated ZernikalosViewer component, auto-regenerates proto on changes
- **Location**: `src/pages/editor/EditorViewer/EditorViewer.tsx`

## Hooks and Utilities

### NestEditorProvider Architecture
- **Purpose**: Centralized editor state management using React Context
- **Location**: `src/pages/editor/providers/NestEditorProvider.tsx`
- **Context**: `src/pages/editor/providers/NestEditorContext.tsx`

### Custom Hooks
- **useNestInternalEditorState**: Core editor state logic
- **useTreeState**: Tree data management and updates
- **useSelectionState**: Node selection handling
- **useTabsState**: Tab management (open/close/switch)
- **useZObjectState**: ZObject data access

### Hook Integration Pattern
```typescript
// Internal hooks combine to create unified state
const editorState = useNestInternalEditorState({ root });
const contextValue = { ...editorState, zkResult };
// Exposed through single context hook
const { selectedZObject, handleSelect } = useNestEditorContext();
```

### Object Utilities
- **findZObjectById**: Recursive object search in ZObject tree
- **findNodeById**: Recursive node search in TreeNode structure
- **convertZObjectToTreeNode**: Converts ZObject to TreeView format
- **handleNameChange**: Object property updates with tree refresh

## Future Enhancements

### Planned Features
- **Property Panels**: Enhanced property editing
- **Object Creation**: New object creation tools
- **Undo/Redo**: History management system
- **Viewer Enhancements**: Additional viewer controls and features

### Extension Points
- **Custom Views**: Additional view modes
- **Plugin System**: Third-party editing tools
- **Export Options**: Multiple export formats
- **Collaboration**: Multi-user editing support

## Best Practices

### Performance
- **Memoization**: Use `useMemo` for expensive computations
- **State Updates**: Minimize unnecessary re-renders
- **Tree Updates**: Efficient tree refresh mechanisms

### User Experience
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error management
- **Responsive Design**: Adapt to different screen sizes

### Code Organization
- **Separation of Concerns**: Clear component responsibilities
- **Custom Hooks**: Reusable logic extraction
- **Named Exports**: All components use named exports for better tree-shaking
- **Context Pattern**: Provider/Consumer pattern for state management
- **Type Safety**: Proper TypeScript usage with strict interfaces
