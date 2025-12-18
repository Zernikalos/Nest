import { useCallback } from 'react'
import { useNavigate } from "@/keepaliverouter"
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { useProject } from './useProject'

export function useCreateProject() {
    const navigate = useNavigate()
    const { isCreateDialogOpen, isCreating, creationError, setIsCreateDialogOpen, setCreating, setCreationError } = useProjectUIStore()
    const { createProject } = useProject()
    
    const handleCreate = useCallback(async (projectName: string) => {
        setCreating(true)
        setCreationError(null)
        
        try {
            // Show Electron dialog
            const filePath = await window.NativeZernikalos?.showSaveProjectDialog(projectName)
            
            if (!filePath) {
                setCreating(false)
                return
            }
            
            // Create project (now uses React Query mutation internally)
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
        isDialogOpen: isCreateDialogOpen,
        setIsDialogOpen: setIsCreateDialogOpen,
        isCreating,
        error: creationError,
        handleCreate,
    }
}

