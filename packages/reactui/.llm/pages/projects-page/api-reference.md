# Project Creation API Reference

Complete API reference for project creation functionality across all layers.

## 🌐 Backend API (NestJS)

### Endpoint

#### `POST /projects/create`

Creates a new project file with metadata.

**Request Body:**
```typescript
{
    name: string        // Project name (required, non-empty)
    filePath: string    // Full path including .zkproj extension (required)
}
```

**Response:**
```typescript
{
    name: string                    // Project name
    version: string                 // "1.0.0"
    createdAt: string              // ISO 8601 timestamp
    lastModified: string           // ISO 8601 timestamp
    zkBuilderVersion?: string      // Optional ZKBuilder version
}
```

**Status Codes:**
- `200 OK` - Project created successfully
- `400 Bad Request` - Validation error (empty name or invalid extension)
- `500 Internal Server Error` - File system error

**Example Request:**
```typescript
POST /projects/create
Content-Type: application/json

{
    "name": "MyProject",
    "filePath": "/Users/username/Projects/MyProject.zkproj"
}
```

**Example Response:**
```json
{
    "name": "MyProject",
    "version": "1.0.0",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastModified": "2024-01-15T10:30:00.000Z"
}
```

**Validation Rules:**
- `name`: Must be non-empty string (trimmed)
- `filePath`: Must end with `.zkproj` extension

**Error Responses:**
```typescript
// 400 Bad Request
{
    "statusCode": 400,
    "message": "Project name cannot be empty"
}

// 400 Bad Request
{
    "statusCode": 400,
    "message": "File path must end with .zkproj extension"
}

// 500 Internal Server Error
{
    "statusCode": 500,
    "message": "Failed to create project directory"
}
```

## 📡 Frontend API Client

### `projectApi.createProject`

**Location:** `src/lib/projectApi.ts`

**Signature:**
```typescript
async function createProject(
    name: string,
    filePath: string
): Promise<ProjectMetadata>
```

**Usage:**
```typescript
import { createProject } from '@/lib/projectApi'

const metadata = await createProject("MyProject", "/path/to/MyProject.zkproj")
console.log(metadata.name) // "MyProject"
```

**Throws:**
- HTTP errors from API call
- Network errors

## ⚡ Electron IPC API

### `window.NativeZernikalos.showSaveProjectDialog`

**Location:** `packages/electronapp/src/preload.ts`

**Signature:**
```typescript
showSaveProjectDialog(projectName: string): Promise<string | null>
```

**Parameters:**
- `projectName: string` - Default filename (without extension)

**Returns:**
- `Promise<string | null>` - Selected file path or `null` if cancelled

**Usage:**
```typescript
const filePath = await window.NativeZernikalos?.showSaveProjectDialog("MyProject")
if (filePath) {
    // User selected a path
    console.log(filePath) // "/Users/username/Projects/MyProject.zkproj"
} else {
    // User cancelled
}
```

**Behavior:**
- Shows native save dialog
- Filters for `.zkproj` files
- Uses project name as default filename
- Remembers last used directory
- Returns `null` if user cancels

### `window.NativeZernikalos.handleCreateProject`

**Location:** `packages/electronapp/src/preload.ts`

**Signature:**
```typescript
handleCreateProject(callback: () => void): { off: () => void }
```

**Parameters:**
- `callback: () => void` - Function called when menu item is selected

**Returns:**
- Object with `off()` method to unsubscribe

**Usage:**
```typescript
const subscription = window.NativeZernikalos?.handleCreateProject(() => {
    console.log("Create project menu item clicked")
})

// Later, to unsubscribe:
subscription?.off()
```

**Events:**
- Triggered when user selects "File → New Project..." from menu

## 🗄️ Zustand Stores API

### `useProjectUIStore`

**Location:** `src/stores/useProjectUIStore.ts`

**State:**
```typescript
{
    isCreateDialogOpen: boolean    // Dialog visibility state
    isCreating: boolean            // Loading state during creation
    creationError: string | null   // Error message if creation fails
}
```

**Actions:**
```typescript
{
    setIsCreateDialogOpen: (open: boolean) => void
    setCreating: (creating: boolean) => void
    setCreationError: (error: string | null) => void
}
```

**Note:** This store contains only state. Business logic is in hooks.

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
```typescript
{
    setProject: (id: string, filePath: string, metadata: ProjectMetadata) => void
    clearProject: () => void
}
```

**Note:** This store contains only state. Business logic is in `useProject` hook.

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
```typescript
{
    setConverting: (converting: boolean) => void
    setError: (error: string | null) => void
    setZkResult: (result: ZkResultExtended | null) => void
    clearZko: () => void
}
```

**Note:** This store contains only state. Business logic is in `useAssetToZko` hook.

## 🎣 React Hooks API

### `useCreateProject`

**Location:** `src/hooks/useCreateProject.ts`

**Signature:**
```typescript
function useCreateProject(): {
    isDialogOpen: boolean
    setIsDialogOpen: (open: boolean) => void
    isCreating: boolean
    error: string | null
    handleCreate: (projectName: string) => Promise<void>
}
```

**Usage:**
```typescript
import { useCreateProject } from '@/hooks/useCreateProject'

function ProjectHeader() {
    const { 
        isDialogOpen, 
        setIsDialogOpen, 
        isCreating, 
        error, 
        handleCreate 
    } = useCreateProject()
    
    return (
        <>
            <button onClick={() => setIsDialogOpen(true)}>
                New Project
            </button>
            <CreateProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onCreate={handleCreate}
                isCreating={isCreating}
                error={error}
            />
        </>
    )
}
```

**Behavior:**
- Wraps store actions
- Automatically navigates to `/editor` on success
- Provides unified API for components

## 🎨 Component APIs

### `CreateProjectDialog`

**Location:** `src/pages/projects/components/CreateProjectDialog.tsx`

**Props:**
```typescript
interface CreateProjectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreate: (projectName: string) => Promise<void>
    isCreating?: boolean
    error?: string | null
}
```

**Usage:**
```typescript
<CreateProjectDialog
    open={isDialogOpen}
    onOpenChange={setIsDialogOpen}
    onCreate={handleCreate}
    isCreating={isCreating}
    error={error}
/>
```

**Behavior:**
- Controlled component (open state from parent)
- Resets input when opened
- Validates non-empty name
- Disables form during creation
- Shows error message if provided
- Auto-focuses input on open

## 🔌 Integration APIs

### `useElectronProjectIntegration` Hook

**Location:** `src/hooks/useElectronProjectIntegration.ts`

**Purpose:**
- Connects Electron events to business logic hooks
- Replaces deprecated `ZkProjectProvider`
- Integrates Electron events with project management

**Usage:**
```typescript
// In App.tsx
function AppContent() {
    useElectronProjectIntegration() // Hook, not provider
    return <YourApp />
}
```

**Event Handlers:**
- `onCreateProject()` → `useProjectUIStore.setIsCreateDialogOpen(true)`
- `onImportFile(data)` → `useAssetToZko.convertAssetToZko(data)`
- `onBundleScene()` → Wrapper handler (ignores undefined `data`) → `useBundleScene.saveBundle()`
- `onOpenProject(data)` → `useProject.openProject(data.filePath)`

**Integration:**
- Called once at app root level
- No context needed (hook-based)
- Handles Electron-specific logic
- Proper cleanup on unmount (calls `offBundleScene()`, `offImportFile()`, etc.)
- Error handling with user-friendly messages

**Dependencies:**
- `useElectronEvents` - Electron event handlers
- `useAssetToZko` - Asset conversion hook
- `useBundleScene` - Scene bundling hook
- `useProjectUIStore` - UI state store
- `useZkoStore` - ZKO state store (for error messages)
- `integrationLogger` - Logger for integration events

## 📝 TypeScript Interfaces

### `CreateProjectDTO`
```typescript
interface CreateProjectDTO {
    name: string
    filePath: string
}
```

### `ProjectMetadata`
```typescript
interface ProjectMetadata {
    name: string
    version: string
    createdAt: string
    lastModified: string
    zkBuilderVersion?: string
}
```

### `AssetConversionData`
```typescript
interface AssetConversionData {
    path: string
    fileName: string
    format: InputFileFormat
}
```

### `ZkResultExtended`
```typescript
interface ZkResultExtended extends ZkConvertResult {
    proto: Uint8Array
}
```

### `InputAsset`
```typescript
interface InputAsset {
    id: string
    path: string
    fileName: string
    format: InputFileFormat
    importedAt: string
}
```

## 🔄 Event Flow

### Menu Event Flow

```
File Menu Click
    ↓
MenuEvents.CREATE_PROJECT (main process)
    ↓
ipcMain.emit()
    ↓
RendererMenuEvents.CREATE_PROJECT (renderer)
    ↓
useElectronProjectIntegration.onCreateProject()
    ↓
useProjectUIStore.setIsCreateDialogOpen(true)
    ↓
CreateProjectDialog opens
```

### IPC Request Flow

```
window.NativeZernikalos.showSaveProjectDialog()
    ↓
ipcRenderer.invoke(SHOW_SAVE_PROJECT_DIALOG)
    ↓
ipcMain.handle(SHOW_SAVE_PROJECT_DIALOG)
    ↓
createProjectDialog()
    ↓
dialog.showSaveDialog()
    ↓
Returns filePath or null
```

## 🚨 Error Handling

### Frontend Errors

**Store Errors:**
- Caught in `createProject` action
- Set in `error` state
- Displayed in dialog
- User can retry

**API Errors:**
- HTTP errors from `projectApi`
- Caught in store
- Error message extracted
- Displayed to user

### Backend Errors

**Validation Errors:**
- `BadRequestException` (400)
- Descriptive error messages
- Logged for debugging

**File System Errors:**
- `InternalServerErrorException` (500)
- Logged with context
- Generic user message

### Electron Errors

**Dialog Cancellation:**
- Returns `null`
- Not treated as error
- User can retry

**IPC Errors:**
- Handled by Electron
- Logged in main process
- May crash renderer if unhandled

