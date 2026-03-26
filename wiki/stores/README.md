# Stores Documentation

This directory contains documentation for Zustand stores used in Zernikalos Studio.

## Architecture Principle

**Stores contain ONLY local/client state (data), no business logic.**

All business logic has been moved to custom hooks. Stores provide:
- Local state definition (client-side state only)
- Simple setters
- No complex operations
- No side effects

**Note**: Server state (like `ProjectMetadata`) is managed by React Query, not Zustand stores. See `/queries/` for server state management.

## Current Stores

### Core Stores

1. **[useProjectStore](./useProjectStore.md)** - Project file path (local state only)
   - `projectFilePath` (local state only)
   - Simple setters: `setProjectPath`, `clearProjectPath`
   - **Note**: Project metadata is managed by React Query (see `/queries/projects.ts`)

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
// In hooks (business logic) - combine local + server state
const { projectFilePath, setProjectPath } = useProjectStore()  // Local state
const { data: projectMetadata } = useProjectQuery(projectFilePath)  // Server state (React Query)

// In components (via hooks)
const { projectMetadata, projectFilePath } = useProject()
```

## Best Practices

1. **Keep stores simple** - Only state and setters
2. **No business logic** - Move to hooks
3. **Type safety** - Use TypeScript interfaces
4. **Selective subscription** - Use selectors when possible

