import { useCallback, useMemo } from 'react'
import { useNavigate } from '@/keepaliverouter'
import { useProjectStore } from '@/stores/useProjectStore'
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { useProjectQuery } from '@/queries'
import type { IInputAsset } from '@/core/Project'
import { ProjectManager } from '@/core/ProjectManager'
import * as projectApi from '@/lib/projectApi'
import { queryClient } from '@/App'

export function useProject() {
    // Use singleton instance of ProjectManager with QueryClient
    const manager = useMemo(() => {
        return ProjectManager.getInstance(
            {
                createProject: projectApi.createProject,
                getProjectByPath: projectApi.getProjectByPath,
                addInputAsset: projectApi.addInputAsset,
            },
            queryClient
        )
    }, [])

    // Estado local: solo el path
    const { projectFilePath, setProjectPath, clearProjectPath } = useProjectStore()
    const { setCreationError, setIsCreateDialogOpen, setCreating } = useProjectUIStore()
    const navigate = useNavigate()
    
    // Estado del servidor: project desde React Query (se actualiza automáticamente cuando Manager actualiza cache)
    const { data: project, isLoading, error } = useProjectQuery(projectFilePath)
    
    const createProject = useCallback(async (name: string, filePath: string) => {
        try {
            // Manager handles cache update directly via QueryClient
            await manager.createProject(name, filePath)
            setProjectPath(filePath)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create project"
            setCreationError(errorMessage)
            throw error
        }
    }, [manager, setProjectPath, setCreationError])
    
    const openProject = useCallback(async (filePath: string) => {
        try {
            // Manager handles cache update directly via QueryClient
            await manager.openProject(filePath)
            setProjectPath(filePath)
        } catch (error) {
            throw error
        }
    }, [manager, setProjectPath])
    
    const closeProject = useCallback(() => {
        manager.closeProject()
        clearProjectPath()
    }, [manager, clearProjectPath])
    
    const addAssetToProject = useCallback(async (asset: Omit<IInputAsset, 'id' | 'importedAt'>) => {
        if (!projectFilePath) {
            throw new Error('No project is currently open')
        }
        
        try {
            // Manager handles cache update directly via QueryClient
            await manager.addAssetToProject(asset)
        } catch (error) {
            throw error
        }
    }, [manager, projectFilePath])
    
    const createProjectWithDialog = useCallback(async (projectName: string) => {
        setCreating(true)
        setCreationError(null)
        
        try {
            // Show Electron dialog
            const filePath = await window.NativeZernikalos?.showSaveProjectDialog(projectName)
            
            if (!filePath) {
                setCreating(false)
                return
            }
            
            // Create project
            await createProject(projectName, filePath)
            
            // Close dialog and navigate
            setIsCreateDialogOpen(false)
            navigate("/editor")
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create project"
            setCreationError(errorMessage)
        } finally {
            setCreating(false)
        }
    }, [createProject, navigate, setIsCreateDialogOpen, setCreating, setCreationError])
    
    return {
        // State from React Query (server state)
        projectFilePath,
        project: project ?? null,
        projectMetadata: project ?? null, // Legacy name for backward compatibility
        isLoading,
        error,
        isProjectOpen: projectFilePath !== null,
        
        // Actions
        createProject,
        createProjectWithDialog,
        openProject,
        closeProject,
        addAssetToProject,
    }
}

