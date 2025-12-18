# Project Creation Flow - Step by Step

This document describes the complete flow of project creation in Zernikalos Studio, from user interaction to file system persistence.

## 🔄 Complete Flow Diagram

```
┌─────────────┐
│   User      │
│  (Action)   │
└──────┬──────┘
       │
       ├─→ Click "New Project" button
       │   OR
       └─→ File menu → "New Project..."
       │
       ▼
┌─────────────────────────────────────┐
│  React UI Layer                      │
│  ┌───────────────────────────────┐  │
│  │ ProjectHeader / Menu Event    │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ useElectronProjectIntegration │  │
│  │ onCreateProject() →            │  │
│  │   setIsCreateDialogOpen(true) │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ CreateProjectDialog           │  │
│  │ - User enters project name    │  │
│  │ - Clicks "Create"             │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ useCreateProject hook          │  │
│  │ handleCreate(projectName)     │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ useProject hook                │  │
│  │ createProject()                │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ useProjectStore                │  │
│  │ setProject()                   │  │
│  └───────────┬───────────────────┘  │
└──────────────┼───────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Electron Layer                      │
│  ┌───────────────────────────────┐  │
│  │ window.NativeZernikalos       │  │
│  │ .showSaveProjectDialog(name)  │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ preload.ts                    │  │
│  │ ipcRenderer.invoke()          │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ MainWindow.ts                 │  │
│  │ ipcMain.handle()              │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ createProjectDialog()         │  │
│  │ - Shows native save dialog    │  │
│  │ - Returns filePath or null    │  │
│  └───────────┬───────────────────┘  │
└──────────────┼───────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  React UI Layer (continued)          │
│  ┌───────────────────────────────┐  │
│  │ useProject hook                │  │
│  │ - Receives filePath            │  │
│  │ - Calls projectApi.create()    │  │
│  └───────────┬───────────────────┘  │
└──────────────┼───────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Backend Layer (NestJS)              │
│  ┌───────────────────────────────┐  │
│  │ projectApi.createProject()    │  │
│  │ POST /projects/create         │  │
│  └───────────┬───────────────────┘  │
|              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ ProjectsController            │  │
│  │ @Post('create')               │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │ ProjectsService               │  │
│  │ createProject()               │  │
│  │ - Validates name & extension   │  │
│  │ - Creates directory           │  │
│  │ - Writes .zkproj file         │  │
│  └───────────┬───────────────────┘  │
└──────────────┼───────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  File System                        │
│  ┌───────────────────────────────┐  │
│  │ /path/to/MyProject.zkproj    │  │
│  │ {                             │  │
│  │   "name": "MyProject",        │  │
│  │   "version": "1.0.0",          │  │
│  │   "createdAt": "...",         │  │
│  │   "lastModified": "..."       │  │
│  │ }                             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  React UI Layer (final)              │
│  ┌───────────────────────────────┐  │
│  │ useCreateProject              │  │
│  │ - Closes dialog               │  │
│  │ - Navigates to /editor        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 📝 Detailed Step-by-Step Flow

### Step 1: User Initiates Creation

**Entry Point A: Button Click**
- User clicks "New Project" button in `ProjectHeader`
- `setIsDialogOpen(true)` is called
- `CreateProjectDialog` opens

**Entry Point B: Menu Selection**
- User selects "File → New Project..." from Electron menu
- `MenuEvents.CREATE_PROJECT` is emitted in main process
- Event is sent to renderer via `RendererMenuEvents.CREATE_PROJECT`
- `useElectronProjectIntegration` listens via `onCreateProject()` callback
- `setIsCreateDialogOpen(true)` is called
- `CreateProjectDialog` opens

### Step 2: User Enters Project Name

- User types project name in `CreateProjectDialog` input
- Form validation ensures name is not empty
- User clicks "Create" button

### Step 3: Dialog Submission

- `CreateProjectDialog` calls `onCreate(projectName)`
- This triggers `handleCreate()` from `useCreateProject` hook
- Hook calls `useProject.createProject()` which orchestrates the flow

### Step 4: Project Creation Execution

The `useProject.createProject()` method:

1. **Shows Electron dialog** via `window.NativeZernikalos.showSaveProjectDialog(projectName)`
2. **Calls API** via `projectApi.createProject(name, filePath)`
3. **Updates store** via `useProjectStore.setProject()`
4. **Handles errors** via `useProjectUIStore.setCreationError()`

### Step 5: Electron Native Dialog

- `preload.ts` exposes `showSaveProjectDialog` which calls `ipcRenderer.invoke()`
- `MainWindow.ts` handles the IPC call via `ipcMain.handle()`
- `createProjectDialog()` function:
  - Shows native save dialog with `.zkproj` filter
  - Uses project name as default filename
  - Remembers last used directory
  - Returns `filePath` if user confirms, `null` if cancelled

### Step 6: API Call

If user didn't cancel:

- `useProject` receives `filePath` from Electron
- Calls `createProject(name, filePath)` from `projectApi`
- Makes `POST /projects/create` request to NestJS backend
- Request body: `{ name: string, filePath: string }`

### Step 7: Backend Processing

`ProjectsController` receives request:

1. **Validates DTO** (name and filePath required)
2. **Calls service** `projectsService.createProject(name, filePath)`

`ProjectsService.createProject()`:

1. **Validates name** (not empty)
2. **Validates extension** (must end with `.zkproj`)
3. **Creates directory** (recursive, if doesn't exist)
4. **Generates metadata**:
   - `name`: trimmed project name
   - `version`: "1.0.0"
   - `createdAt`: current ISO timestamp
   - `lastModified`: current ISO timestamp
5. **Writes file** to filesystem as JSON
6. **Returns** `ProjectMetadata` object

### Step 8: Success Handling

- API call succeeds
- `useProject` updates `useProjectStore` with project data
- `useCreateProject` closes dialog (`setIsCreateDialogOpen(false)`)
- `useCreateProject` navigates to `/editor`
- Loading state is cleared (`setCreating(false)`)

### Step 9: Error Handling

If any step fails:

- Error is caught in hook's try/catch
- Error message is set in `useProjectUIStore` via `setCreationError()`
- Dialog remains open showing error
- Loading state is cleared (`setCreating(false)`)
- User can retry or cancel

## 🔑 Key State Management

### Store State

**useProjectUIStore:**
```typescript
{
    isCreateDialogOpen: boolean    // Controls dialog visibility
    isCreating: boolean            // Loading state during creation
    creationError: string | null   // Error message if creation fails
}
```

**useProjectStore:**
```typescript
{
    projectId: string | null
    projectFilePath: string | null
    projectMetadata: ProjectMetadata | null
}
```

### State Transitions

```
Initial → Dialog Open → Creating → Success → Navigate
                ↓            ↓
            Cancel      Error (retry)
```

## 🎯 Error Scenarios

1. **User cancels Electron dialog**
   - `filePath` is `null`
   - Store sets `isCreating: false`
   - Dialog remains open, user can try again

2. **Invalid project name**
   - Frontend validation: empty name
   - Backend validation: empty name or wrong extension

3. **File system errors**
   - Directory creation fails
   - File write fails
   - Backend throws `InternalServerErrorException`
   - Error message shown in dialog

4. **Network errors**
   - API call fails
   - Error caught in store
   - Error message shown in dialog

## 🔄 State Management Pattern

The hook-based architecture ensures that:

- State is managed in stores (single source of truth)
- Business logic is in hooks (reusable and testable)
- Components access state via hooks (clean separation)
- Consistent UX regardless of entry point

