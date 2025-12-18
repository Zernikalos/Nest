# Project Creation Flow - Documentation

This documentation explains the complete project creation flow in Zernikalos Studio, from user interaction to the creation of the `.zkproj` file in the file system.

## 📋 Table of Contents

- **[Complete Flow](./flow.md)** - Step-by-step flow diagram and explanation
- **[Architecture](./architecture.md)** - Components and responsibilities of each layer
- **[API Reference](./api-reference.md)** - Endpoints, interfaces, and TypeScript types

## 🎯 Executive Summary

The project creation system is divided into three main layers:

1. **Frontend (React)** - UI and presentation logic
2. **Electron** - Native dialogs and IPC communication
3. **Backend (NestJS)** - REST API and file creation

### Simplified Flow

```
User → React UI → Electron Dialog → NestJS API → File System
```

## 🏗️ Main Components

### Frontend (React)

- **`CreateProjectDialog`** - Modal to enter project name
- **`useCreateProject`** - Hook that orchestrates the complete flow
- **`useProjectCreationStore`** - Zustand store for creation state
- **`projectApi`** - HTTP client for backend communication

### Electron

- **`createProjectDialog`** - Native dialog to choose location
- **IPC Handlers** - Communication between renderer and main process
- **Menu Integration** - "New Project..." option in File menu

### Backend (NestJS)

- **`ProjectsController`** - `POST /projects/create` endpoint
- **`ProjectsService`** - Business logic and file creation
- **Validation** - Name and `.zkproj` extension

## 📁 Key Files

### Frontend
- `src/pages/projects/components/CreateProjectDialog.tsx`
- `src/hooks/useCreateProject.ts`
- `src/stores/useProjectCreationStore.ts`
- `src/lib/projectApi.ts`
- `src/providers/ZkProject/ZkProjectProvider.tsx`

### Electron
- `packages/electronapp/src/dialogs/createProjectDialog.ts`
- `packages/electronapp/src/MainWindow.ts`
- `packages/electronapp/src/preload.ts`
- `packages/electronapp/src/menu/fileMenu.ts`

### Backend
- `packages/nestserver/src/projects/projects.controller.ts`
- `packages/nestserver/src/projects/projects.service.ts`
- `packages/nestserver/src/projects/projects.module.ts`

## 🔄 Entry Points

The user can initiate project creation from two places:

1. **"New Project" button** in `ProjectHeader`
2. **File menu → "New Project..."** (Electron menu)

Both entry points use the same flow and shared state through the `ZkProjectProvider` context.

## 📝 Project Format

Projects are saved as `.zkproj` files containing metadata in JSON format:

```json
{
    "name": "MyProject",
    "version": "1.0.0",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastModified": "2024-01-01T00:00:00.000Z",
    "zkBuilderVersion": "optional"
}
```

## 🚀 Next Steps

- [ ] "Open Project" functionality
- [ ] Existing project validation
- [ ] Project templates
- [ ] Recent projects management

