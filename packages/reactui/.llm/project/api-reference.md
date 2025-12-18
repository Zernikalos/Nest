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

## 🗄️ Zustand Store API

### `useProjectCreationStore`

**Location:** `src/stores/useProjectCreationStore.ts`

**State:**
```typescript
{
    isDialogOpen: boolean      // Dialog visibility state
    isCreating: boolean        // Loading state during creation
    error: string | null       // Error message if creation fails
}
```

**Actions:**
```typescript
{
    setIsDialogOpen: (open: boolean) => void
    createProject: (projectName: string, onSuccess?: () => void) => Promise<void>
    resetError: () => void
}
```

**Usage:**
```typescript
import { useProjectCreationStore } from '@/stores'

function MyComponent() {
    const { 
        isDialogOpen, 
        setIsDialogOpen, 
        isCreating, 
        error, 
        createProject 
    } = useProjectCreationStore()
    
    const handleCreate = async () => {
        await createProject("MyProject", () => {
            console.log("Project created!")
        })
    }
}
```

**Action Details:**

#### `setIsDialogOpen(open: boolean)`
- Sets dialog visibility
- No side effects

#### `createProject(projectName, onSuccess?)`
- Validates project name
- Shows Electron save dialog
- Calls API if path selected
- Handles errors
- Calls `onSuccess` callback on success
- Updates loading and error states

#### `resetError()`
- Clears error state
- Sets `error: null`

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

## 🔌 Provider APIs

### `ZkProjectProvider`

**Location:** `src/providers/ZkProject/ZkProjectProvider.tsx`

**Props:**
```typescript
{
    children: React.ReactNode
}
```

**Usage:**
```typescript
<ZkProjectProvider>
    <App />
</ZkProjectProvider>
```

**Responsibilities:**
- Listens for Electron menu events
- Updates dialog state when menu triggered
- Handles file import events
- Handles scene bundling events

**Internal Integration:**
- Uses `useElectronEvents()` for IPC
- Uses `useProjectCreationStore()` for state
- Sets up event listeners on mount
- Cleans up on unmount

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

### `ProjectCreationState`
```typescript
interface ProjectCreationState {
    isDialogOpen: boolean
    isCreating: boolean
    error: string | null
    
    setIsDialogOpen: (open: boolean) => void
    createProject: (projectName: string, onSuccess?: () => void) => Promise<void>
    resetError: () => void
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
ZkProjectProvider.onCreateProject()
    ↓
setIsDialogOpen(true)
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

