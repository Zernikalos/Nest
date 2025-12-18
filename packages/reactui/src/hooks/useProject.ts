import { useCallback } from 'react'
import { useProjectStore } from '@/stores/useProjectStore'
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { useProjectQuery, useCreateProjectMutation, useAddAssetMutation } from '@/queries'
import type { InputAsset } from '@/lib/projectApi'

export function useProject() {
    // Estado local: solo el path
    const { projectFilePath, setProjectPath, clearProjectPath } = useProjectStore()
    const { setCreationError } = useProjectUIStore()
    
    // Estado del servidor: metadata desde React Query
    const { data: projectMetadata, isLoading, error } = useProjectQuery(projectFilePath)
    
    // Mutations
    const createMutation = useCreateProjectMutation()
    const addAssetMutation = useAddAssetMutation()
    
    const createProjectAction = useCallback(async (name: string, filePath: string) => {
        try {
            await new Promise<void>((resolve, reject) => {
                createMutation.mutate(
                    { name, filePath },
                    {
                        onSuccess: () => {
                            setProjectPath(filePath)
                            resolve()
                        },
                        onError: (error) => {
                            const errorMessage = error instanceof Error ? error.message : "Failed to create project"
                            setCreationError(errorMessage)
                            reject(error)
                        },
                    }
                )
            })
        } catch (error) {
            throw error
        }
    }, [createMutation, setProjectPath, setCreationError])
    
    const openProject = useCallback((filePath: string) => {
        // React Query hará el fetch automáticamente cuando projectFilePath cambie
        setProjectPath(filePath)
    }, [setProjectPath])
    
    const closeProject = useCallback(() => {
        clearProjectPath()
    }, [clearProjectPath])
    
    const addAssetToProject = useCallback(async (asset: Omit<InputAsset, 'id' | 'importedAt'>) => {
        if (!projectFilePath) {
            throw new Error('No project is currently open')
        }
        
        await new Promise<void>((resolve, reject) => {
            addAssetMutation.mutate(
                { filePath: projectFilePath, asset },
                {
                    onSuccess: () => {
                        resolve()
                    },
                    onError: (error) => {
                        reject(error)
                    },
                }
            )
        })
    }, [projectFilePath, addAssetMutation])
    
    return {
        // State
        projectFilePath,
        projectMetadata: projectMetadata ?? null,
        isLoading,
        error,
        isProjectOpen: projectFilePath !== null,
        
        // Actions
        createProject: createProjectAction,
        openProject,
        closeProject,
        addAssetToProject,
    }
}

