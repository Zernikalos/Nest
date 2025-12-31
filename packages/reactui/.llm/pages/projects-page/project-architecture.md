# Project Architecture - Complete Overview

## 📋 Project Definition

### Data Structure
**Location:** `src/core/Project.ts`

```typescript
interface Project {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
    assets?: InputAsset[];
}
```

### Related Types
- **`InputAsset`**: Asset imported into a project
- **`CreateProjectDTO`**: DTO for creating a new project
- **`ProjectManagerState`**: Internal state of ProjectManager

---

## 🏗️ Management Architecture

The system manages Project through **3 main layers**:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  React Components (ProjectPage, ProjectEditView, etc.)      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                       │
│  Hooks (useProject, useElectronProjectIntegration)           │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ React Query  │ │ Zustand      │ │ ProjectManager       │
│ (Server)     │ │ (Local)      │ │ (Business + Cache)   │
│              │ │              │ │ - Uses QueryClient   │
└──────┬───────┘ └──────┬────────┘ └──────┬───────────────┘
       │               │                 │
       │               │                 │ (Same QueryClient)
       └───────────────┼─────────────────┘
                       ▼
            ┌──────────────────┐
            │  Backend API      │
            │  (NestJS Server)  │
            └──────────────────┘
```

---

## 📦 Management Layers

### 1. **React Query** (Server State)
**Location:** `src/queries/projects.ts`

**Responsibilities:**
- Server data caching (via QueryClient)
- Automatic synchronization with backend
- Loading/error state management for read operations

**Hooks:**
- `useProjectQuery(filePath)`: Reads project from cache (managed by ProjectManager)

**Query Keys:**
```typescript
projectKeys = {
    all: ['projects'],
    detail: (filePath: string) => ['projects', filePath]
}
```

**Note:** Mutations (`useCreateProjectMutation`, `useAddAssetMutation`) have been removed. ProjectManager now handles cache updates directly via QueryClient.

### 2. **Zustand Stores** (Local State)
**Locations:**
- `src/stores/useProjectStore.ts`
- `src/stores/useProjectUIStore.ts`

**useProjectStore:**
- Only stores `projectFilePath: string | null`
- Minimal state needed to identify the open project

**useProjectUIStore:**
- `isCreateDialogOpen`: UI control for creation dialog
- `isCreating`: Loading state during creation
- `creationError`: Creation errors

### 3. **ProjectManager** (Business Logic + Cache Management)
**Location:** `src/core/ProjectManager.ts`

**Characteristics:**
- Singleton (single global instance)
- React-agnostic (pure class using QueryClient core)
- Uses QueryClient directly for cache management
- Internal state with listeners
- Main methods:
  - `createProject(name, filePath)`: Creates project and updates QueryClient cache
  - `openProject(filePath)`: Opens project using `fetchQuery()` (with cache support)
  - `closeProject()`: Closes current project
  - `addAssetToProject(asset)`: Adds asset and updates QueryClient cache
  - `refreshProject()`: Refreshes current project (reuses `openProject()`)

**QueryClient Integration:**
- Receives QueryClient instance via `getInstance(api, queryClient)`
- Uses `queryClient.fetchQuery()` for reads (with caching)
- Uses `queryClient.setQueryData()` for cache updates after mutations
- Shares the same QueryClient instance with React Query hooks

**Internal State:**
```typescript
{
    filePath: string | null
    project: Project | null
    isLoading: boolean
    error: Error | null
}
```

---

## 🔄 Data Flow

### Create Project
```
User → CreateProjectDialog
    ↓
useProject.createProject()
    ↓
manager.createProject() → API Backend
    ↓
manager.queryClient.setQueryData() → Updates cache directly
    ↓
useProjectQuery reads from cache → React Query updates automatically
    ↓
Components re-render with fresh data
```

### Open Project
```
User → ProjectHeader.openProject()
    ↓
useProject.openProject(filePath)
    ↓
manager.openProject() → queryClient.fetchQuery() → API Backend (with cache)
    ↓
Cache updated automatically by fetchQuery
    ↓
useProjectQuery reads from cache → React Query updates automatically
    ↓
Components receive project from React Query
```

### Add Asset
```
User → useAssetToZko or drag & drop
    ↓
useProject.addAssetToProject(asset)
    ↓
manager.addAssetToProject() → API Backend
    ↓
manager.queryClient.setQueryData() → Updates cache directly
    ↓
useProjectQuery reads from cache → React Query updates automatically
    ↓
Components display new asset
```

---

## 📍 Interaction Points

### Components Using Project

1. **`ProjectPage.tsx`**
   - Main projects page
   - Uses: `useProject()`

2. **`ProjectEditView.tsx`**
   - Project editing view
   - Uses: `useProject()` → `projectMetadata`, `projectFilePath`
   - Displays: name, path, assets

3. **`ProjectAssetsList.tsx`**
   - List of project assets
   - Uses: `useProject()` → `projectMetadata.assets`
   - Displays: list of `InputAsset[]`

4. **`ProjectHeader.tsx`**
   - Header with project actions
   - Uses: `useProject()` → `createProjectWithDialog`, `openProject`
   - Actions: create, open project

5. **`CreateProjectDialog.tsx`**
   - Dialog for creating project
   - Uses: `useProjectUIStore` for dialog state

### Hooks Interacting with Project

1. **`useProject.ts`** ⭐ (Main)
   - Main orchestration hook (simplified)
   - Combines: React Query (read-only) + Zustand + ProjectManager
   - Exposes: `project`, `projectFilePath`, `isLoading`, `error`
   - Actions: `createProject`, `openProject`, `closeProject`, `addAssetToProject`
   - **No manual synchronization needed**: Manager handles cache updates directly

2. **`useElectronProjectIntegration.ts`**
   - Integrates Electron events with Project
   - Listens to: `onOpenProject`, `onCreateProject`
   - Uses: `useProject().openProject()`

3. **`useAssetToZko.ts`**
   - Converts assets to ZKO
   - Uses: `useProject().addAssetToProject()`

4. **`useBundleScene.ts`**
   - Scene bundling
   - May use project data

### API Layer

**Location:** `src/lib/projectApi.ts`

**Functions:**
- `createProject(name, filePath)`: POST `/projects/create`
- `getProjectByPath(filePath)`: GET `/projects/by-path`
- `addInputAsset(filePath, asset)`: POST `/projects/add-asset`

**Interface:**
```typescript
interface ProjectApiClient {
    createProject(name: string, filePath: string): Promise<Project>
    getProjectByPath(filePath: string): Promise<Project>
    addInputAsset(filePath: string, asset: Omit<InputAsset, 'id' | 'importedAt'>): Promise<Project>
}
```

---

## 🔗 Layer Synchronization

### Simplified Synchronization

**No manual synchronization needed!** ProjectManager directly manages the QueryClient cache:

```typescript
// In ProjectManager methods:
async createProject(name: string, filePath: string) {
    const project = await this.api.createProject(name, filePath)
    // Direct cache update
    this.queryClient.setQueryData(projectKeys.detail(filePath), project)
    // ...
}

async openProject(filePath: string) {
    // Uses fetchQuery which handles caching automatically
    const project = await this.queryClient.fetchQuery({
        queryKey: projectKeys.detail(filePath),
        queryFn: () => this.api.getProjectByPath(filePath),
        staleTime: 30000
    })
    // ...
}
```

**Simplified Flow:**
1. Manager method called (e.g., `createProject`)
2. Manager updates QueryClient cache directly
3. React Query hooks automatically detect cache changes
4. Components re-render with fresh data
5. Only `filePath` is manually synced to Zustand (for UI state)

**Benefits:**
- No bidirectional synchronization needed
- Single source of truth (QueryClient cache)
- Manager methods are self-contained
- Less code, fewer bugs

---

## 🎯 Design Principles

### 1. Separation of Concerns
- **React Query**: Server state reading (Project data from cache)
- **Zustand**: Local state (filePath, UI state)
- **ProjectManager**: Business logic + cache management (React-agnostic, uses QueryClient core)

### 2. Single Source of Truth
- **Backend** is the source of truth
- **QueryClient cache** is the single source of truth in the frontend
- Manager directly manages QueryClient cache
- React Query hooks read from the same cache

### 3. Single API Call
- Manager methods call API directly
- Manager updates cache after success
- No duplicate calls, no manual synchronization

### 4. Direct Cache Management
- Manager → QueryClient cache (direct updates via `setQueryData` or `fetchQuery`)
- React Query hooks → QueryClient cache (automatic reads)
- No bidirectional synchronization needed
- Zustand only for UI state (filePath)

---

## 📊 Key Files Summary

| File | Responsibility |
|------|----------------|
| `core/Project.ts` | Type definitions |
| `core/ProjectManager.ts` | Business logic + cache management (singleton) |
| `queries/projects.ts` | React Query queries (read-only) |
| `App.tsx` | Exports QueryClient instance |
| `hooks/useProject.ts` | Main orchestration hook |
| `lib/projectApi.ts` | API client (HTTP calls) |
| `stores/useProjectStore.ts` | Local state (filePath) |
| `stores/useProjectUIStore.ts` | UI state (dialogs, errors) |
| `pages/projects/*` | UI components |
| `hooks/useElectronProjectIntegration.ts` | Electron integration |

---

## 🔍 Entry Points

### From UI:
- `ProjectHeader` → `createProjectWithDialog()` / `openProject()`
- `CreateProjectDialog` → `createProject()`
- Drag & Drop → `addAssetToProject()`

### From Electron:
- `onOpenProject` event → `openProject()`
- `onCreateProject` event → `setIsCreateDialogOpen(true)`

### From Other Hooks:
- `useAssetToZko` → `addAssetToProject()`
- `useBundleScene` → may read project data

---

## ✅ Advantages of Current Architecture

1. **Simplified Synchronization**: Manager directly manages cache, no manual sync needed
2. **Single Call**: No request duplication
3. **Smart Caching**: QueryClient handles caching automatically (used by both Manager and React Query)
4. **Single Source of Truth**: QueryClient cache is the single source for server state
5. **Clear Separation**: Each layer has its responsibility
6. **Testable**: Manager is React-agnostic and independently testable
7. **Less Code**: Eliminated ~60 lines of synchronization code
8. **Better Performance**: Direct cache updates, no intermediate state management

