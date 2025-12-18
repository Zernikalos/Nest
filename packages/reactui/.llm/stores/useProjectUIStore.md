# useProjectUIStore

## Overview
The `useProjectUIStore` is a Zustand store that manages UI-related state for project operations, such as dialog visibility, loading states, and error messages.

## Purpose
- **UI State Management**: Controls dialog visibility and UI feedback
- **Loading States**: Tracks operation progress
- **Error Display**: Stores error messages for user feedback

## Architecture
```
Zustand Store → State Only → Hooks → Components
```

## State Structure
```typescript
interface ProjectUIState {
    isCreateDialogOpen: boolean
    isCreating: boolean
    creationError: string | null
}

interface ProjectUIActions {
    setIsCreateDialogOpen: (open: boolean) => void
    setCreating: (creating: boolean) => void
    setCreationError: (error: string | null) => void
}
```

## Key Actions

### `setIsCreateDialogOpen(open: boolean)`
- Controls the visibility of the project creation dialog
- Used when opening/closing the dialog

### `setCreating(creating: boolean)`
- Updates the creation operation status
- Used to show/hide loading indicators during project creation

### `setCreationError(error: string | null)`
- Sets or clears error messages
- Handles creation failures and validation errors

## Usage

### In Hooks (Business Logic)
```typescript
import { useProjectUIStore } from '@/stores/useProjectUIStore'

// In useCreateProject hook
const { isCreateDialogOpen, isCreating, creationError, setIsCreateDialogOpen, setCreating, setCreationError } = useProjectUIStore()
```

### In Components (via Hooks)
```typescript
// Components should use hooks, not stores directly
const { isDialogOpen, setIsDialogOpen, isCreating, error, handleCreate } = useCreateProject()
```

## Related Hooks

- `useCreateProject` - Project creation logic (uses this store)
- `useProject` - Project management (uses this store for errors)

## Important Notes

- **State Only**: This store contains only state, no business logic
- **No React Hooks**: Store functions are pure and don't use React hooks
- **UI Focused**: Only UI-related state, not business data

