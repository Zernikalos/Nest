# Stores Documentation

This directory contains documentation for Zustand stores used in Zernikalos Studio.

## Architecture Principle

**Stores contain ONLY state (data), no business logic.**

All business logic has been moved to custom hooks. Stores provide:
- State definition
- Simple setters
- No complex operations
- No side effects

## Current Stores

### Core Stores

1. **[useProjectStore](./useProjectStore.md)** - Project state management
   - `projectId`, `projectFilePath`, `projectMetadata`
   - Simple setters: `setProject`, `clearProject`

2. **[useZkoStore](./useZkoStore.md)** - Current ZKO state
   - `isConverting`, `conversionError`, `zkResult`
   - Simple setters: `setConverting`, `setError`, `setZkResult`, `clearZko`

3. **[useProjectUIStore](./useProjectUIStore.md)** - UI state
   - `isCreateDialogOpen`, `isCreating`, `creationError`
   - Simple setters: `setIsCreateDialogOpen`, `setCreating`, `setCreationError`

## Deprecated Stores (Removed)

- ~~`useZkProjectStore`~~ - Replaced by `useZkoStore` + hooks
- ~~`useProjectCreationStore`~~ - Replaced by `useProjectUIStore` + hooks

## Usage Pattern

```typescript
// In hooks (business logic)
const { zkResult, setZkResult } = useZkoStore()

// In components (via hooks)
const { zkResult, convertAssetToZko } = useAssetToZko()
```

## Best Practices

1. **Keep stores simple** - Only state and setters
2. **No business logic** - Move to hooks
3. **Type safety** - Use TypeScript interfaces
4. **Selective subscription** - Use selectors when possible

