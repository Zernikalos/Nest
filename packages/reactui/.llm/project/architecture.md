# Project Creation Architecture

This document describes the architecture and component responsibilities for the project creation system.

## 🏗️ Three-Layer Architecture

The project creation system follows a three-layer architecture:

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  UI Components, Hooks, State Management │
└──────────────┬──────────────────────────┘
               │ IPC Communication
┌──────────────▼──────────────────────────┐
│         Electron Layer                  │
│  Native Dialogs, IPC Handlers           │
└──────────────┬──────────────────────────┘
               │ HTTP REST API
┌──────────────▼──────────────────────────┐
│         Backend (NestJS)                │
│  Controllers, Services, File I/O        │
└─────────────────────────────────────────┘
```

## 📦 Frontend Layer (React)

### Component Hierarchy

```
App
└── ZkProjectProvider (Context Provider)
    └── ProjectPage
        ├── ProjectHeader
        │   └── CreateProjectDialog
        └── ProjectTemplates
            └── (can also trigger CreateProjectDialog)
```

### Components

#### `CreateProjectDialog`
**Location:** `src/pages/projects/components/CreateProjectDialog.tsx`

**Responsibility:**
- Renders modal UI for project name input
- Handles form submission
- Displays loading and error states
- Validates input (non-empty name)

**Props:**
```typescript
{
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreate: (projectName: string) => Promise<void>
    isCreating?: boolean
    error?: string | null
}
```

**Key Features:**
- Controlled component (open state from parent)
- Auto-focus on input when opened
- Resets name when dialog opens
- Disables form during creation

#### `ProjectHeader`
**Location:** `src/pages/projects/components/ProjectHeader.tsx`

**Responsibility:**
- Renders header with logo and description
- Provides "New Project" button
- Integrates `CreateProjectDialog`
- Uses `useCreateProject` hook

**Integration:**
- Connects UI to creation flow
- Manages dialog visibility via hook

#### `ProjectTemplates`
**Location:** `src/pages/projects/components/ProjectTemplates.tsx`

**Responsibility:**
- Can trigger project creation from templates
- Uses shared dialog state via context

### Hooks

#### `useCreateProject`
**Location:** `src/hooks/useCreateProject.ts`

**Responsibility:**
- Orchestrates creation flow
- Connects store to navigation
- Provides unified API for components

**Returns:**
```typescript
{
    isDialogOpen: boolean
    setIsDialogOpen: (open: boolean) => void
    isCreating: boolean
    error: string | null
    handleCreate: (projectName: string) => Promise<void>
}
```

**Flow:**
1. Receives project name from dialog
2. Calls store action
3. Navigates to editor on success

### State Management

#### `useProjectCreationStore`
**Location:** `src/stores/useProjectCreationStore.ts`

**Type:** Zustand store

**State:**
```typescript
{
    isDialogOpen: boolean
    isCreating: boolean
    error: string | null
}
```

**Actions:**
- `setIsDialogOpen(open: boolean)` - Control dialog visibility
- `createProject(name, onSuccess?)` - Main creation logic
- `resetError()` - Clear error state

**Creation Flow:**
1. Validates project name
2. Shows Electron save dialog
3. Calls API if path selected
4. Handles success/error
5. Calls optional success callback

### API Client

#### `projectApi`
**Location:** `src/lib/projectApi.ts`

**Responsibility:**
- HTTP client for project API
- TypeScript interfaces for DTOs
- Error handling

**Functions:**
- `createProject(name: string, filePath: string): Promise<ProjectMetadata>`

**Interfaces:**
```typescript
CreateProjectDTO {
    name: string
    filePath: string
}

ProjectMetadata {
    name: string
    version: string
    createdAt: string
    lastModified: string
    zkBuilderVersion?: string
}
```

### Providers

#### `ZkProjectProvider`
**Location:** `src/providers/ZkProject/ZkProjectProvider.tsx`

**Responsibility:**
- Bridges Electron events to React state
- Listens for menu events
- Updates dialog state when menu triggered

**Event Handlers:**
- `onCreateProject()` - Opens dialog when menu item selected
- `onImportFile()` - File import handling
- `onBundleScene()` - Scene bundling handling

**Integration:**
- Wraps entire app in context
- Provides shared state access
- Handles Electron-specific logic

## ⚡ Electron Layer

### IPC Communication

#### Preload Script
**Location:** `packages/electronapp/src/preload.ts`

**Exposed APIs:**
```typescript
window.NativeZernikalos {
    showSaveProjectDialog(projectName: string): Promise<string | null>
    handleCreateProject(callback: Function): { off: Function }
}
```

**Security:**
- Uses `contextBridge` for secure IPC
- Exposes only necessary APIs
- Provides cleanup methods

#### Main Process Handlers
**Location:** `packages/electronapp/src/MainWindow.ts`

**IPC Handlers:**

1. **`ipcMain.handle(SHOW_SAVE_PROJECT_DIALOG)`**
   - Receives project name from renderer
   - Calls `createProjectDialog()`
   - Returns file path or null

2. **`ipcMain.on(CREATE_PROJECT)`**
   - Listens for menu event
   - Sends event to renderer
   - Triggers dialog via context

### Dialogs

#### `createProjectDialog`
**Location:** `packages/electronapp/src/dialogs/createProjectDialog.ts`

**Responsibility:**
- Shows native save dialog
- Configures dialog options
- Remembers last used directory
- Returns selected path

**Configuration:**
- Title: "Create New Project"
- Default filename: `{projectName}.zkproj`
- Filter: `.zkproj` files
- Properties: create directory, overwrite confirmation

**State:**
- Maintains `lastPath` for directory memory
- Uses project name as default filename

### Menu Integration

#### File Menu
**Location:** `packages/electronapp/src/menu/fileMenu.ts`

**Menu Item:**
```typescript
{
    label: "New Project...",
    click: () => ipcMain.emit(MenuEvents.CREATE_PROJECT)
}
```

**Event Flow:**
- Menu click → `MenuEvents.CREATE_PROJECT`
- Main process emits event
- Renderer receives via `RendererMenuEvents.CREATE_PROJECT`
- Context opens dialog

## 🚀 Backend Layer (NestJS)

### Module Structure

#### `ProjectsModule`
**Location:** `packages/nestserver/src/projects/projects.module.ts`

**Responsibility:**
- Registers controller and service
- Provides dependency injection
- Exports for use in AppModule

### Controller

#### `ProjectsController`
**Location:** `packages/nestserver/src/projects/projects.controller.ts`

**Endpoint:**
```typescript
@Post('create')
async createProject(@Body() dto: CreateProjectDTO): Promise<ProjectMetadata>
```

**Route:** `POST /projects/create`

**Responsibility:**
- Receives HTTP requests
- Validates DTO
- Delegates to service
- Returns project metadata

**DTO:**
```typescript
class CreateProjectDTO {
    name!: string
    filePath!: string
}
```

### Service

#### `ProjectsService`
**Location:** `packages/nestserver/src/projects/projects.service.ts`

**Method:**
```typescript
async createProject(name: string, filePath: string): Promise<ProjectMetadata>
```

**Responsibilities:**

1. **Validation**
   - Project name not empty
   - File path ends with `.zkproj`

2. **Directory Creation**
   - Creates parent directory if doesn't exist
   - Uses recursive creation
   - Handles filesystem errors

3. **Metadata Generation**
   - Generates ISO timestamps
   - Sets version to "1.0.0"
   - Trims project name

4. **File Writing**
   - Writes JSON to filesystem
   - Pretty-printed (4 spaces)
   - UTF-8 encoding

5. **Error Handling**
   - `BadRequestException` for validation errors
   - `InternalServerErrorException` for I/O errors
   - Logs errors with context

**Metadata Structure:**
```typescript
interface ProjectMetadata {
    name: string
    version: string
    createdAt: string        // ISO 8601
    lastModified: string    // ISO 8601
    zkBuilderVersion?: string
}
```

## 🔄 Data Flow

### Request Flow

```
User Input
    ↓
CreateProjectDialog (projectName)
    ↓
useCreateProject.handleCreate()
    ↓
useProjectCreationStore.createProject()
    ↓
Electron: showSaveProjectDialog() → filePath
    ↓
projectApi.createProject(name, filePath)
    ↓
POST /projects/create
    ↓
ProjectsController.createProject()
    ↓
ProjectsService.createProject()
    ↓
File System: Write .zkproj file
    ↓
Return ProjectMetadata
    ↓
Store: Close dialog, navigate
```

### State Updates

```
Dialog Open
    ↓
User Types Name
    ↓
User Clicks Create
    ↓
isCreating: true
    ↓
Electron Dialog
    ↓
API Call
    ↓
Success → isCreating: false, dialog closed, navigate
Error → isCreating: false, error set, dialog open
```

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

## 🎯 Design Patterns

1. **Context Pattern**
   - Shared state via React Context
   - Single source of truth
   - Event-driven updates

2. **Store Pattern**
   - Zustand for state management
   - Actions for side effects
   - Separation of concerns

3. **Provider Pattern**
   - Wraps app with providers
   - Handles integration logic
   - Clean component code

4. **Hook Pattern**
   - Custom hooks for logic reuse
   - Composable functionality
   - Clean component code

5. **Service Pattern**
   - Business logic in services
   - Controllers handle HTTP
   - Separation of concerns

