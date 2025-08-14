# useZkProjectStore

## Overview
The `useZkProjectStore` is a Zustand store that manages the state and logic for Zernikalos project operations, particularly file import and conversion workflows. It provides a centralized state management solution using Zustand's lightweight state management library.

## Purpose
- **State Management**: Centralized state for project data and import operations
- **File Conversion**: Handles ZK file conversion workflows
- **Import Status**: Tracks import progress and errors
- **Project Data**: Stores converted ZK objects and metadata

## Architecture
```
Zustand Store → State + Actions → React Components
```

## State Structure
```typescript
interface ZkProjectState {
    // State
    isImporting: boolean        // Import operation status
    importError: string | null  // Error messages
    zkResult: ZkConvertResult | null  // Conversion results
    
    // Actions
    setImporting: (importing: boolean) => void
    setError: (error: string | null) => void
    setZkResult: (result: ZkConvertResult | null) => void
    cleanProject: () => void
    handleFileImport: (data: FileImportData) => Promise<void>
}
```

## Key Actions

### `setImporting(importing: boolean)`
- Updates the import operation status
- Used to show/hide loading indicators

### `setError(error: string | null)`
- Sets or clears error messages
- Handles import failures and validation errors

### `setZkResult(result: ZkConvertResult | null)`
- Stores the converted ZK file data
- Contains the parsed object tree and metadata

### `cleanProject()`
- Resets all state to initial values
- Clears imported data and errors
- Useful for starting new projects

### `handleFileImport(data: FileImportData)`
- **Core functionality**: Processes file import workflow
- **Steps**:
  1. Gets file URL from backend
  2. Converts file using ZKBuilder
  3. Updates state with results
  4. Handles errors gracefully

## File Import Workflow
1. **Validation**: Checks file format and data
2. **Backend Request**: Gets file URL via `getFileUrl()`
3. **Conversion**: Uses `zkConvert()` from ZKBuilder
4. **State Update**: Stores results in store
5. **Error Handling**: Catches and stores any errors

## Dependencies
- **Zustand**: State management library
- **ZKBuilder**: `@zernikalos/zkbuilder` for file conversion
- **File API**: `getFileUrl()` for backend communication

## Usage Examples

### Basic State Access
```typescript
const { zkResult, isImporting } = useZkProjectStore()
```

### Selective State Subscription
```typescript
const zkResult = useZkProjectStore(state => state.zkResult)
```

### Action Execution
```typescript
const { cleanProject, handleFileImport } = useZkProjectStore()
cleanProject() // Reset project
```

## Performance Benefits
- **Selective Re-rendering**: Components only update when subscribed state changes
- **No Context Re-renders**: Avoids unnecessary re-renders from React Context
- **Efficient Updates**: Zustand's built-in optimization for state updates

## Important Notes
- **No React Hooks**: Store functions are pure and don't use React hooks
- **Async Operations**: `handleFileImport` is async and handles promises
- **Error Boundaries**: All errors are caught and stored in state
- **State Persistence**: State persists across component unmounts

## Related Components
- `ZkProjectProvider` - Sets up Electron integration
- `useZkProject` - Public hook for components
- `EditorView` - Main consumer of store data
- All components that need project state
