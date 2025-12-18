import { useCallback } from 'react'
import { useProjectStore } from '@/stores/useProjectStore'
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { createProject, getProjectByPath, addInputAsset } from '@/lib/projectApi'
import type { InputAsset } from '@/lib/projectApi'

export function useProject() {
    const { projectId, projectFilePath, projectMetadata, setProject, clearProject } = useProjectStore()
    const { setCreationError } = useProjectUIStore()
    
    const createProjectAction = useCallback(async (name: string, filePath: string) => {
        try {
            const metadata = await createProject(name, filePath)
            // Use filePath as projectId for now, until we have a proper ID system
            setProject(filePath, filePath, metadata)
            return metadata
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to create project"
            setCreationError(errorMessage)
            throw error
        }
    }, [setProject, setCreationError])
    
    const openProject = useCallback(async (filePath: string) => {
        try {
            const metadata = await getProjectByPath(filePath)
            // Use filePath as projectId for now, until we have a proper ID system
            setProject(filePath, filePath, metadata)
            return metadata
        } catch (error) {
            throw error
        }
    }, [setProject])
    
    const closeProject = useCallback(() => {
        clearProject()
    }, [clearProject])
    
    const addAssetToProject = useCallback(async (asset: Omit<InputAsset, 'id' | 'importedAt'>) => {
        if (!projectId) {
            throw new Error('No project is currently open')
        }
        
        const updated = await addInputAsset(projectId, asset)
        setProject(projectId, projectFilePath!, updated)
        return updated
    }, [projectId, projectFilePath, setProject])
    
    return {
        // State
        projectId,
        projectFilePath,
        projectMetadata,
        isProjectOpen: projectId !== null,
        
        // Actions
        createProject: createProjectAction,
        openProject,
        closeProject,
        addAssetToProject,
    }
}

