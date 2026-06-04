# Project Management Architecture

This document describes the architecture and component responsibilities for the project management system, including project creation, asset conversion, and ZKO management.

## 🏗️ Architecture Overview

The project management system follows a clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Components                      │
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
│  - useElectronProjectIntegration         │
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

## 📦 Stores Layer (State Only)

### `useProjectStore`
**Location:** `src/stores/useProjectStore.ts`

**State:**
```typescript
{
    projectId: string | null
    projectFilePath: string | null
    projectMetadata: ProjectMetadata | null
}
```

**Actions:**
- `setProject(id, filePath, metadata)` - Set current project
- `clearProject()` - Clear project state

**Responsibility:**
- Stores project identification and metadata
- No business logic, only state

### `useZkoStore`
**Location:** `src/stores/useZkoStore.ts`

**State:**
```typescript
{
    isConverting: boolean
    conversionError: string | null
    zkResult: ZkResultExtended | null
}
```

**Actions:**
- `setConverting(converting)` - Update conversion status
- `setError(error)` - Set/clear error
- `setZkResult(result)` - Store ZKO result
- `clearZko()` - Clear ZKO state

**Responsibility:**
- Stores current ZKO file in use
- Tracks conversion status
- No business logic, only state

### `useProjectUIStore`
**Location:** `src/stores/useProjectUIStore.ts`

**State:**
```typescript
{
    isCreateDialogOpen: boolean
    isCreating: boolean
    creationError: string | null
}
```

**Actions:**
- `setIsCreateDialogOpen(open)` - Control dialog visibility
- `setCreating(creating)` - Update creation status
- `setCreationError(error)` - Set/clear error

**Responsibility:**
- Stores UI-related state
- Dialog visibility and loading states
- No business logic, only state

## 🎣 Hooks Layer (Business Logic)

### `useProject`
**Location:** `src/hooks/useProject.ts`

**Responsibility:**
- Project management operations
- Orchestrates between stores and services

**Methods:**
- `createProject(name, filePath)` - Create new project
- `openProject(filePath)` - Open existing project
- `closeProject()` - Close current project
- `addAssetToProject(asset)` - Add asset to project

**Uses:**
- `useProjectStore` - Project state
- `useProjectUIStore` - UI state
- `projectApi` - Backend communication

### `useAssetToZko`
**Location:** `src/hooks/useAssetToZko.ts`

**Responsibility:**
- Converts 3D assets to ZKO format
- Handles conversion workflow

**Methods:**
- `convertAssetToZko(data)` - Convert asset to ZKO
- `regenerateZko()` - Regenerate proto buffer
- `clearZko()` - Clear ZKO state

**Uses:**
- `useZkoStore` - ZKO state
- `useProject` - Project management
- `fileApi` - File operations
- `zkConvert`, `zkExport` - ZKBuilder functions

**Workflow:**
1. Get file URL from backend
2. Convert asset using ZKBuilder
3. Generate proto buffer
4. Store result in `useZkoStore`
5. Optionally save to project

### `useCreateProject`
**Location:** `src/hooks/useCreateProject.ts`

**Responsibility:**
- Orchestrates project creation flow
- Connects UI to business logic

**Methods:**
- `handleCreate(projectName)` - Create project flow

**Uses:**
- `useProjectUIStore` - UI state
- `useProject` - Project logic
- `window.NativeZernikalos` - Electron dialogs

**Flow:**
1. Show Electron save dialog
2. Call `useProject.createProject()`
3. Close dialog and navigate on success

### `useBundleScene`
**Location:** `src/hooks/useBundleScene.ts`

**Responsibility:**
- Bundles and exports ZKO scene
- Handles file saving
- Validates ZKO result before bundling
- Error handling and logging

**Methods:**
- `bundleScene()` - Export ZKO to proto format
- `saveBundle()` - Save bundle via Electron (validates zkResult, handles errors)

**Uses:**
- `useZkoStore` - Reads current ZKO
- `zkExport` - ZKBuilder export function
- `bundleSceneLogger` - Logger for bundle operations (namespace: `electron:bundle-scene`)

**Error Handling:**
- Validates `zkResult` exists before bundling
- Logs warnings if no ZKO result available
- Catches and logs errors during export
- Throws errors for upstream handling

### `useElectronProjectIntegration`
**Location:** `src/hooks/useElectronProjectIntegration.ts`

**Responsibility:**
- Integrates Electron events with hooks
- Replaces deprecated `ZkProjectProvider`
- Handles event cleanup and error management

**Event Handlers:**
- File import → `useAssetToZko.convertAssetToZko()`
- Bundle scene → Wrapper handler → `useBundleScene.saveBundle()` (ignores undefined `data` parameter)
- Create project → `useProjectUIStore.setIsCreateDialogOpen()`
- Open project → `useProject.openProject()`

**Uses:**
- `useElectronEvents` - Electron event handlers
- `useAssetToZko` - Asset conversion
- `useBundleScene` - Scene bundling
- `useProjectUIStore` - UI state
- `integrationLogger` - Logger for integration events (namespace: `electron:integration`)

**Features:**
- Wraps event handlers to handle Electron IPC parameter mismatches
- Proper cleanup with `offBundleScene()`, `offImportFile()`, etc.
- Error handling with user-friendly error messages
- Logging for debugging Electron event flow

## 🔌 Integration Layer

### `ElectronProvider`
**Location:** `src/providers/Electron/ElectronProvider.tsx`

**Responsibility:**
- Provides Electron event handlers
- Environment detection
- IPC communication setup

**Provides:**
- `useElectronEvents()` hook
- `isElectron` flag
- Event subscription methods

### `useElectronProjectIntegration` Hook
**Location:** `src/hooks/useElectronProjectIntegration.ts`

**Responsibility:**
- Connects Electron events to business logic
- Replaces deprecated `ZkProjectProvider`

**Usage:**
```typescript
// In App.tsx
function AppContent() {
    useElectronProjectIntegration()
    return <YourApp />
}
```

## 🔄 Data Flow

### Project Creation Flow
```
User Action
    ↓
useCreateProject.handleCreate()
    ↓
useProject.createProject()
    ↓
useProjectStore.setProject()
    ↓
projectApi.createProject()
    ↓
Backend API
```

### Asset Conversion Flow
```
Electron Event
    ↓
useElectronProjectIntegration
    ↓
useAssetToZko.convertAssetToZko()
    ↓
useZkoStore.setZkResult()
    ↓
Components Update
```

### Scene Bundling Flow
```
Electron Menu Event (Bundle Scene)
    ↓
MainWindow.sendOnChannel('ide:executeCommand', { commandId: 'file.bundleScene' })
    ↓
ElectronProvider.onExecuteCommand() callback
    ↓
useElectronProjectIntegration handler (ignores undefined data)
    ↓
useBundleScene.saveBundle()
    ↓
Validates zkResult exists
    ↓
useZkoStore (read zkResult)
    ↓
bundleScene() → zkExport()
    ↓
Electron: actionSaveFile() (awaited)
    ↓
bundleSceneDialog() → File saved
```

**Error Handling:**
- If `zkResult` is null: Warning logged, operation aborted
- If export fails: Error logged and thrown
- If save fails: Error caught in integration handler, user error message set

## 🎯 Design Patterns

### 1. Separation of Concerns
- **Stores**: Only state, no logic
- **Hooks**: All business logic
- **Providers**: External integration only
- **Services**: Backend communication

### 2. Hook Composition
- Hooks can use other hooks
- Business logic composed from smaller hooks
- Reusable across components

### 3. Store Access Pattern
- Direct access: `useZkoStore.getState()` for stable functions
- Hook access: Components use hooks, not stores directly
- Selective subscription: `useZkoStore(state => state.zkResult)`

### 4. Event-Driven Integration
- Electron events trigger hooks
- Hooks update stores
- Stores trigger component updates

## 🔐 Security Considerations

1. **Electron IPC**
   - Uses `contextBridge` for secure communication
   - No direct Node.js access from renderer
   - Preload script validates inputs

2. **Backend Validation**
   - Validates all inputs
   - Prevents path traversal
   - Validates file extensions

3. **Error Handling**
   - No sensitive information in error messages
   - Proper exception types
   - Logging for debugging

## 📝 Migration Notes

### Deprecated (Removed)
- `useZkProjectStore` → `useZkoStore` + `useAssetToZko` + `useBundleScene`
- `useProjectCreationStore` → `useProjectUIStore` + `useProject` + `useCreateProject`
- `ZkProjectProvider` → `useElectronProjectIntegration` hook
- `useZkProject` → `useAssetToZko` directly

### Naming Changes
- `useFileImport` → `useAssetToZko`
- `useProcessingStore` → `useZkoStore`
- `rebuildZkResult` → `regenerateZko`
- `FileImportData` → `AssetConversionData`
- `isImporting` → `isConverting`
- `importError` → `conversionError`
