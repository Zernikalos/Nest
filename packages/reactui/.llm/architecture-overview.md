# Architecture Overview

## Project Structure
Zernikalos Studio is a React-based 3D editor application built with modern architecture patterns, using Zustand for state management and Electron for desktop functionality.

## Core Architecture

### Separation of Concerns

The architecture follows a clear separation of responsibilities:

```
┌─────────────────────────────────────────┐
│           Components                     │
│    (UI and User Interaction)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            Hooks                         │
│    (Business Logic & Orchestration)      │
│  - useProject                            │
│  - useAssetToZko                         │
│  - useCreateProject                      │
│  - useBundleScene                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            Stores                        │
│    (State Management Only)               │
│  - useProjectStore                       │
│  - useZkoStore                           │
│  - useProjectUIStore                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Providers                       │
│    (External System Integration)         │
│  - ElectronProvider                      │
│  - useElectronProjectIntegration         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Services                       │
│    (Backend Communication)              │
│  - projectApi                            │
│  - fileApi                               │
└─────────────────────────────────────────┘
```

### State Management Layer

**Stores (State Only):**
- `useProjectStore` - Project state (id, filePath, metadata)
- `useZkoStore` - Current ZKO in use (conversion state, result)
- `useProjectUIStore` - UI state (dialogs, loading, errors)

**Hooks (Business Logic):**
- `useProject` - Project management (create, open, close, add assets)
- `useAssetToZko` - Asset conversion to ZKO format
- `useCreateProject` - Project creation orchestration
- `useBundleScene` - Scene bundling and export
- `useElectronProjectIntegration` - Electron event integration

### Provider Layer

```
App.tsx
├── ElectronProvider (Electron APIs)
├── useElectronProjectIntegration() (Hook, not provider)
├── ThemeProvider (UI Theming)
└── RouterProvider (Navigation)
```

**Note:** `ZkProjectProvider` has been replaced by `useElectronProjectIntegration` hook for better separation of concerns.

### Component Layer

```
Components → Hooks → Stores
     ↓
EditorView, TreeView, Forms
```

## Key Design Principles

### 1. Separation of Concerns
- **Stores**: Only state (data), no business logic
- **Hooks**: Business logic and orchestration
- **Providers**: Integration with external systems (Electron)
- **Services**: Backend communication (API calls)
- **Components**: UI and user interaction

### 2. State Management Strategy
- **Zustand over Context**: Better performance, selective re-rendering
- **Store per Domain**: Separate stores for different concerns
- **Pure Stores**: Only state and simple setters, no business logic
- **Logic in Hooks**: All business logic moved to custom hooks

### 3. Electron Integration
- **Hook Pattern**: `useElectronProjectIntegration` replaces provider
- **Event-Driven**: IPC communication for file operations
- **Environment Detection**: Web vs Desktop functionality

## Data Flow

### Asset Conversion Workflow
```
Electron Event → useElectronProjectIntegration → useAssetToZko → useZkoStore → Components
```

### Project Creation Workflow
```
User Action → useCreateProject → useProject → useProjectStore → API → Backend
```

### State Updates
```
User Action → Hook → Store Update → Component Re-render
```

## File Organization

### `/src/stores/`
- Zustand stores for state management
- Pure state only, no business logic
- Simple setters, no complex operations

### `/src/hooks/`
- Custom hooks for business logic
- Orchestrate between stores and services
- Reusable across components

### `/src/providers/`
- React context providers
- Integration between different systems
- Minimal providers (only when context needed)

### `/src/lib/`
- API clients and services
- Backend communication
- Utility functions

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

### Hook Optimization
- **Stable Functions**: Hooks use `useCallback` to prevent unnecessary re-renders
- **Store Access**: Direct store access when needed (e.g., `useZkoStore.getState()`)
- **Dependency Management**: Careful dependency arrays to prevent loops

### Provider Optimization
- **Minimal Wrappers**: Only essential providers
- **Hook-based Integration**: `useElectronProjectIntegration` instead of provider wrapper
- **Cleanup**: Proper event listener management

## Architecture Benefits

### Testability
- **Hooks**: Can be tested independently
- **Stores**: Can be tested in isolation
- **Providers**: Can be tested with mocks

### Reusability
- **Hooks**: Composable and reusable across components
- **Stores**: Shared state across application
- **Services**: Reusable API clients

### Maintainability
- **Clear Separation**: Changes in logic → only hooks
- **State Changes**: Only stores affected
- **Integration Changes**: Only providers/hooks affected

### Scalability
- **Easy to Add**: New hooks, stores, or services
- **Modular**: Each piece independent
- **Extensible**: Easy to extend functionality

## Migration Notes

### Deprecated (Removed)
- `useZkProjectStore` → Replaced by `useZkoStore` + `useAssetToZko` + `useBundleScene`
- `useProjectCreationStore` → Replaced by `useProjectUIStore` + `useProject` + `useCreateProject`
- `ZkProjectProvider` → Replaced by `useElectronProjectIntegration` hook
- `useZkProject` → Replaced by `useAssetToZko` directly

### Naming Changes
- `useFileImport` → `useAssetToZko`
- `useProcessingStore` → `useZkoStore`
- `rebuildZkResult` → `regenerateZko`
- `FileImportData` → `AssetConversionData`

## Best Practices

### Store Design
- Keep stores focused on single domains
- Only state and simple setters
- Use TypeScript interfaces for state
- No business logic in stores

### Hook Design
- Encapsulate business logic
- Use `useCallback` for stable functions
- Access stores directly when needed
- Compose hooks for complex operations

### Provider Usage
- Use providers only when context is needed
- Prefer hooks for integration logic
- Implement proper cleanup
- Minimize provider nesting

### Component Architecture
- Connect to stores via hooks
- Use selective state subscription
- Implement proper error boundaries
- Keep components focused on UI
