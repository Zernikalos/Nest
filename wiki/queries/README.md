# React Query Queries

This directory contains React Query queries and mutations for server state management.

## Overview

React Query (TanStack Query) is used to manage **server state** (data from the backend), while Zustand stores are used for **local/client state** only.

## Architecture

```
┌─────────────────────────────────────┐
│      React Query (Server State)     │
│  - ProjectMetadata                  │
│  - AppSettings                      │
│  - Automatic caching                │
│  - Background refetching            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Zustand (Local State)          │
│  - projectFilePath                  │
│  - UI state                         │
│  - ZKO conversion state             │
└─────────────────────────────────────┘
```

## File Organization

### `/src/queries/projects.ts`
Contains queries and mutations for project management:
- `useProjectQuery(filePath)` - Fetch project metadata
- `useCreateProjectMutation()` - Create new project
- `useAddAssetMutation()` - Add asset to project
- `projectKeys` - Query key factory for cache management

### `/src/queries/settings.ts`
Contains queries and mutations for application settings:
- `useSettingsQuery()` - Fetch application settings
- `useUpdateSettingsMutation()` - Update settings with optimistic updates
- `AppSettings` - Type definition for settings

### `/src/queries/index.ts`
Central export point for all queries and mutations. Always import from this file:

```typescript
import { useProjectQuery, useSettingsQuery } from '@/queries'
```

## Usage Pattern

### In Hooks

Hooks combine local state (Zustand) with server state (React Query):

```typescript
// useProject.ts
export function useProject() {
    // Local state: projectFilePath
    const { projectFilePath, setProjectPath } = useProjectStore()
    
    // Server state: projectMetadata (automatically fetched)
    const { data: projectMetadata, isLoading, error } = useProjectQuery(projectFilePath)
    
    // Mutations for server state
    const createMutation = useCreateProjectMutation()
    
    const openProject = useCallback((filePath: string) => {
        setProjectPath(filePath) // React Query will fetch automatically
    }, [setProjectPath])
    
    return {
        projectFilePath,        // From Zustand
        projectMetadata,        // From React Query
        isLoading,             // From React Query
        openProject,
        // ...
    }
}
```

### In Components

Components use hooks, not React Query directly:

```typescript
// Component
const { projectMetadata, isLoading, error } = useProject()
```

## Key Principles

### 1. Separation of Concerns
- **React Query**: Server state (ProjectMetadata, AppSettings)
- **Zustand**: Local state (projectFilePath, UI state, ZKO state)

### 2. Automatic Caching
React Query automatically caches server responses and handles:
- Background refetching
- Cache invalidation
- Loading and error states
- Optimistic updates (for mutations)

### 3. Query Key Factory
Use query key factories for consistent cache management:

```typescript
export const projectKeys = {
    all: ['projects'] as const,
    detail: (filePath: string) => [...projectKeys.all, filePath] as const,
}
```

### 4. Mutations with Cache Updates
Mutations automatically update the cache:

```typescript
export function useAddAssetMutation() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: addInputAsset,
        onSuccess: (data, variables) => {
            // Update cache with new data
            queryClient.setQueryData(projectKeys.detail(variables.filePath), data)
        },
    })
}
```

## Benefits

1. **Automatic Caching**: Server responses are cached and reused
2. **Background Refetching**: Data stays fresh automatically
3. **Loading/Error States**: Built-in state management
4. **Optimistic Updates**: Immediate UI updates with rollback on error
5. **Cache Invalidation**: Easy to invalidate and refetch when needed
6. **Type Safety**: Full TypeScript support

## Migration Notes

### Before (Zustand only)
```typescript
// Store contained everything
interface ProjectState {
    projectId: string | null
    projectFilePath: string | null
    projectMetadata: ProjectMetadata | null  // Server state in Zustand
}
```

### After (Zustand + React Query)
```typescript
// Zustand: Only local state
interface ProjectState {
    projectFilePath: string | null  // Local state only
}

// React Query: Server state (ProjectMetadata)
const { data: projectMetadata } = useProjectQuery(projectFilePath)
```

## Best Practices

1. **Always import from index.ts**: `import { ... } from '@/queries'`
2. **Use hooks, not React Query directly**: Components should use `useProject()`, not `useProjectQuery()`
3. **Combine local + server state in hooks**: Hooks orchestrate between Zustand and React Query
4. **Use query key factories**: Consistent cache key management
5. **Handle mutations properly**: Update cache on success, handle errors


