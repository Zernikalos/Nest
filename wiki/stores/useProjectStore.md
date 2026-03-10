# useProjectStore

## Overview
The `useProjectStore` is a Zustand store that manages **local state only** - specifically the file path of the currently open project. Project metadata (from the server) is managed by React Query, not this store.

## Purpose
- **Local State Only**: Stores only the project file path
- **Project File Path**: Tracks which project file is currently open
- **No Server State**: Project metadata is managed by React Query (see `/queries/`)

## Architecture
```
Zustand Store (Local State) → Hooks → React Query (Server State) → Components
```

## State Structure
```typescript
interface ProjectState {
    projectFilePath: string | null  // Only local state
}

interface ProjectActions {
    setProjectPath: (filePath: string) => void
    clearProjectPath: () => void
}
```

## Key Actions

### `setProjectPath(filePath: string)`
- Sets the current project file path
- Used when opening or creating a project
- React Query automatically fetches metadata when path changes

### `clearProjectPath()`
- Resets project file path to null
- Used when closing a project
- React Query cache remains but query is disabled

## Usage

### In Hooks (Business Logic)
```typescript
import { useProjectStore } from '@/stores/useProjectStore'
import { useProjectQuery } from '@/queries'

// In useProject hook - combines local + server state
const { projectFilePath, setProjectPath } = useProjectStore()  // Local state
const { data: projectMetadata } = useProjectQuery(projectFilePath)  // Server state
```

### In Components (via Hooks)
```typescript
// Components should use hooks, not stores directly
const { projectFilePath, projectMetadata, isProjectOpen } = useProject()
```

## Related Files

- `useProject` hook - Combines Zustand (local) + React Query (server)
- `queries/projects.ts` - React Query queries/mutations for project metadata

## Important Notes

- **Local State Only**: This store contains only local state (file path), not server state
- **Server State**: Project metadata is managed by React Query (see `/queries/projects.ts`)
- **No React Hooks**: Store functions are pure and don't use React hooks
- **State Persistence**: Local state persists across component unmounts
- **Automatic Fetching**: When `projectFilePath` changes, React Query automatically fetches metadata

