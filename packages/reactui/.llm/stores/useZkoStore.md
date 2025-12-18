# useZkoStore

## Overview
The `useZkoStore` is a Zustand store that manages the state of the current ZKO (Zernikalos KObject) file being used in the application. It stores conversion state and the ZKO result.

## Purpose
- **ZKO State Management**: Maintains the current ZKO file in use
- **Conversion Status**: Tracks asset conversion progress and errors
- **Result Storage**: Stores the converted ZKO data and metadata

## Architecture
```
Zustand Store → State Only → Hooks → Components
```

## State Structure
```typescript
interface ZkoState {
    isConverting: boolean
    conversionError: string | null
    zkResult: ZkResultExtended | null
}

interface ZkoActions {
    setConverting: (converting: boolean) => void
    setError: (error: string | null) => void
    setZkResult: (result: ZkResultExtended | null) => void
    clearZko: () => void
}
```

## Key Actions

### `setConverting(converting: boolean)`
- Updates the conversion operation status
- Used to show/hide loading indicators

### `setError(error: string | null)`
- Sets or clears error messages
- Handles conversion failures and validation errors

### `setZkResult(result: ZkResultExtended | null)`
- Stores the converted ZKO file data
- Contains the parsed object tree, metadata, and proto buffer

### `clearZko()`
- Resets all state to initial values
- Clears ZKO data and errors
- Useful for starting new conversions

## Usage

### In Hooks (Business Logic)
```typescript
import { useZkoStore } from '@/stores/useZkoStore'

// In useAssetToZko hook
const { zkResult, setZkResult, setConverting, setError } = useZkoStore()

// Direct store access when needed (stable functions)
const currentZkResult = useZkoStore.getState().zkResult
```

### In Components (via Hooks)
```typescript
// Components should use hooks, not stores directly
const { zkResult, isConverting, conversionError } = useAssetToZko()
```

### Selective State Subscription
```typescript
// Only subscribe to specific state
const zkResult = useZkoStore(state => state.zkResult)
```

## Related Hooks

- `useAssetToZko` - Asset conversion logic (uses this store)
- `useBundleScene` - Scene bundling (reads from this store)

## Related Types

- `ZkResultExtended` - Extended ZK conversion result with proto buffer
- `AssetConversionData` - Input data for asset conversion

## Important Notes

- **State Only**: This store contains only state, no business logic
- **No React Hooks**: Store functions are pure and don't use React hooks
- **Direct Access**: Can use `useZkoStore.getState()` for stable function references
- **State Persistence**: State persists across component unmounts

## Migration from useZkProjectStore

This store replaces the deprecated `useZkProjectStore`. The conversion logic has been moved to `useAssetToZko` hook.

**Before:**
```typescript
const { handleFileImport, zkResult } = useZkProjectStore()
```

**After:**
```typescript
const { convertAssetToZko, zkResult } = useAssetToZko()
```

