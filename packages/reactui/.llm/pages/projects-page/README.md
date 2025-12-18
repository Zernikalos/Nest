# Projects Page - Documentation

This documentation explains the complete project management system in Zernikalos Studio, including project creation, asset conversion, and ZKO management.

## 📋 Table of Contents

- **[Architecture](./architecture.md)** - Components and responsibilities of each layer
- **[Flow](./flow.md)** - Step-by-step flow diagrams and explanations
- **[API Reference](./api-reference.md)** - Endpoints, interfaces, and TypeScript types

## 🎯 Executive Summary

The project management system follows a clear separation of concerns:

1. **Stores** - State only (data)
2. **Hooks** - Business logic and orchestration
3. **Providers** - External system integration (Electron)
4. **Services** - Backend communication (API)

### Architecture Overview

```
User Action → Hook → Store → Service → Backend
                ↓
            Component Update
```

## 🏗️ Main Components

### Stores (State Only)

- **`useProjectStore`** - Project state (id, filePath, metadata)
- **`useZkoStore`** - Current ZKO state (conversion status, result)
- **`useProjectUIStore`** - UI state (dialogs, loading, errors)

### Hooks (Business Logic)

- **`useProject`** - Project management (create, open, close, add assets)
- **`useAssetToZko`** - Asset conversion to ZKO format
- **`useCreateProject`** - Project creation orchestration
- **`useBundleScene`** - Scene bundling and export
- **`useElectronProjectIntegration`** - Electron event integration

### Services

- **`projectApi`** - Project API client
- **`fileApi`** - File API client

## 📁 Key Files

### Stores
- `src/stores/useProjectStore.ts`
- `src/stores/useZkoStore.ts`
- `src/stores/useProjectUIStore.ts`

### Hooks
- `src/hooks/useProject.ts`
- `src/hooks/useAssetToZko.ts`
- `src/hooks/useCreateProject.ts`
- `src/hooks/useBundleScene.ts`
- `src/hooks/useElectronProjectIntegration.ts`

### Services
- `src/lib/projectApi.ts`
- `src/lib/fileApi.ts`

### Types
- `src/types/project.ts` - Shared types and utilities

## 🔄 Key Workflows

### Project Creation
1. User triggers creation (button or menu)
2. `useCreateProject` orchestrates flow
3. `useProject` handles project logic
4. `useProjectStore` stores project state
5. API creates `.zkproj` file

### Asset Conversion
1. Electron event triggers import
2. `useElectronProjectIntegration` receives event
3. `useAssetToZko` converts asset to ZKO
4. `useZkoStore` stores conversion result
5. Component displays ZKO data

### Scene Bundling
1. User triggers bundle
2. `useBundleScene` reads from `useZkoStore`
3. Exports ZKO to proto format
4. Electron saves file

## 🎯 Design Principles

### Separation of Concerns
- **Stores**: Only state, no logic
- **Hooks**: All business logic
- **Providers**: External integration only
- **Services**: Backend communication

### Naming Conventions
- Stores: `use[Domain]Store` (e.g., `useZkoStore`)
- Hooks: `use[Action]` (e.g., `useAssetToZko`)
- Services: `[domain]Api` (e.g., `projectApi`)

## 🚀 Migration Notes

### Deprecated (Removed)
- `useZkProjectStore` → `useZkoStore` + `useAssetToZko` + `useBundleScene`
- `useProjectCreationStore` → `useProjectUIStore` + `useProject` + `useCreateProject`
- `ZkProjectProvider` → `useElectronProjectIntegration` hook

### Naming Changes
- `useFileImport` → `useAssetToZko`
- `useProcessingStore` → `useZkoStore`
- `rebuildZkResult` → `regenerateZko`
- `FileImportData` → `AssetConversionData`

