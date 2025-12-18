# useProjectStore

## Overview
The `useProjectStore` is a Zustand store that manages the state of the currently open project. It stores project identification, file path, and metadata.

## Purpose
- **Project State**: Maintains the current project information
- **Project Identification**: Stores project ID and file path
- **Metadata Storage**: Stores project metadata from `.zkproj` file

## Architecture
```
Zustand Store → State Only → Hooks → Components
```

## State Structure
```typescript
interface ProjectState {
    projectId: string | null
    projectFilePath: string | null
    projectMetadata: ProjectMetadata | null
}

interface ProjectActions {
    setProject: (id: string, filePath: string, metadata: ProjectMetadata) => void
    clearProject: () => void
}
```

## Key Actions

### `setProject(id, filePath, metadata)`
- Sets the current project information
- Updates all project-related state at once
- Used when opening or creating a project

### `clearProject()`
- Resets all project state to null
- Clears project identification and metadata
- Used when closing a project

## Usage

### In Hooks (Business Logic)
```typescript
import { useProjectStore } from '@/stores/useProjectStore'

// In useProject hook
const { projectId, projectFilePath, projectMetadata, setProject, clearProject } = useProjectStore()
```

### In Components (via Hooks)
```typescript
// Components should use hooks, not stores directly
const { projectId, isProjectOpen, projectMetadata } = useProject()
```

## Related Hooks

- `useProject` - Project management logic (uses this store)
- `useCreateProject` - Project creation (uses `useProject`)

## Related Types

- `ProjectMetadata` - Project metadata from `.zkproj` file

## Important Notes

- **State Only**: This store contains only state, no business logic
- **No React Hooks**: Store functions are pure and don't use React hooks
- **State Persistence**: State persists across component unmounts

