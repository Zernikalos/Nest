# Editor Page Documentation

## Overview

The Editor Page is the main interface of Zernikalos Studio, providing a comprehensive 3D editing environment. It consists of a tree view for object hierarchy and a main editing area with tabs and different view modes.

## Location
- **Main Component**: `src/pages/editor/EditorPage.tsx`
- **Core View**: `src/pages/editor/EditorView/EditorView.tsx`
- **New Project**: `src/pages/editor/NewProject.tsx`

## Page Structure

### Main Components
```
EditorPage
├── NewProject (when no project active)
└── EditorView (when project active)
    ├── TreeView (left panel - 25% width)
    ├── EditorViewTopBar (top tabs)
    └── EditorViewContent (main content - 75% width)
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
- **Data Source**: Connected to `useZkProjectStore` for project data
- **Tree Conversion**: Converts Zernikalos objects to TreeView format
- **Selection Management**: Handles node selection and tree updates

### Editing Interface
- **Tab System**: Multiple tabs for different objects
- **View Modes**: Form and Code view options
- **Object Editing**: Direct editing of Zernikalos objects

## State Management

### Local State
- **projectActive**: Boolean for project loading state
- **treeUpdateTrigger**: Counter for forcing tree updates
- **activeView**: Current view mode ('form' | 'code')

### Store Integration
- **useZkProjectStore**: Main project data and state
- **useEditorState**: Custom hook for editor-specific state

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
- **Form View**: Property editing interface
- **Code View**: Code-based editing (future implementation)

## Data Flow

### Project Loading
```
useZkProjectStore → zkResult → TreeView data → EditorView
```

### Object Selection
```
TreeView selection → activeNode → selectedZObject → EditorViewContent
```

### Object Updates
```
User input → handleNameChange → object update → tree refresh
```

## Component Integration

### TreeView Component
- **Purpose**: Display object hierarchy
- **Data**: Converted from Zernikalos objects
- **Selection**: Integrated with editor state

### EditorViewTopBar
- **Purpose**: Tab management interface
- **Features**: Tab switching, closing, view mode selection
- **State**: Connected to editor state hooks

### EditorViewContent
- **Purpose**: Main editing interface
- **Modes**: Form and code editing
- **Data**: Selected object properties

## Hooks and Utilities

### useEditorState
- **Purpose**: Centralized editor state management
- **Features**: Selection, tabs, navigation
- **Integration**: Connects TreeView with editor interface

### Object Utilities
- **findZObjectById**: Recursive object search
- **convertZObjectToTreeNode**: Data format conversion
- **handleNameChange**: Object property updates

## Future Enhancements

### Planned Features
- **Code View**: Advanced code editing interface
- **Property Panels**: Enhanced property editing
- **Object Creation**: New object creation tools
- **Undo/Redo**: History management system

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
- **Type Safety**: Proper TypeScript usage
