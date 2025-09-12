# Architecture Overview

## Project Structure
Zernikalos Studio is a React-based 3D editor application built with modern architecture patterns, using Zustand for state management and Electron for desktop functionality.

## Core Architecture

### State Management Layer
```
Zustand Stores → React Components
     ↓
useZkProjectStore (Project State)
useUserStore (Future)
useSettingsStore (Future)
```

### Provider Layer
```
App.tsx
├── ElectronProvider (Electron APIs)
├── ZkProjectProvider (Project Integration)
├── ThemeProvider (UI Theming)
└── RouterProvider (Navigation)
```

### Component Layer
```
Components → Hooks → Stores
     ↓
EditorView, TreeView, Forms
```

## Key Design Principles

### 1. Separation of Concerns
- **Stores**: Pure state management (Zustand)
- **Providers**: React context and integration
- **Components**: UI and user interaction
- **Hooks**: Logic abstraction and reuse

### 2. State Management Strategy
- **Zustand over Context**: Better performance, selective re-rendering
- **Store per Domain**: Separate stores for different concerns
- **Actions in Stores**: Business logic centralized in stores

### 3. Electron Integration
- **Provider Pattern**: Centralized Electron setup
- **Event-Driven**: IPC communication for file operations
- **Environment Detection**: Web vs Desktop functionality

## Data Flow

### File Import Workflow
```
Electron Main → IPC Event → ZkProjectProvider → useZkProjectStore → Components
```

### State Updates
```
User Action → Store Action → State Change → Component Re-render
```

## File Organization

### `/src/stores/`
- Zustand stores for state management
- Pure business logic, no React dependencies

### `/src/providers/`
- React context providers
- Integration between different systems

### `/src/components/`
- Reusable UI components
- Connected to stores via hooks

### `/src/pages/`
- Route-based page components
- Main application views

## Performance Considerations

### Zustand Benefits
- **Selective Updates**: Components only re-render when needed
- **No Context Re-renders**: Avoids unnecessary updates
- **Built-in Optimization**: Efficient state change detection

### Provider Optimization
- **Minimal Wrappers**: Only essential providers
- **Lazy Loading**: Providers only when needed
- **Cleanup**: Proper event listener management

## Future Scalability

### Store Expansion
- User management store
- Settings and preferences store
- Project history store

### Provider Growth
- Authentication provider
- Plugin system provider
- Collaboration provider

## Best Practices

### Store Design
- Keep stores focused on single domains
- Use TypeScript interfaces for state
- Implement proper error handling

### Provider Usage
- Minimize provider nesting
- Use providers only for cross-cutting concerns
- Implement proper cleanup

### Component Architecture
- Connect to stores via custom hooks
- Use selective state subscription
- Implement proper error boundaries
