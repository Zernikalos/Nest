import { create } from 'zustand'
import { createProject } from '@/lib/projectApi'

interface ProjectCreationState {
    // State
    isDialogOpen: boolean
    isCreating: boolean
    error: string | null
    
    // Actions
    setIsDialogOpen: (open: boolean) => void
    createProject: (projectName: string, onSuccess?: () => void) => Promise<void>
    resetError: () => void
}

export const useProjectCreationStore = create<ProjectCreationState>((set, get) => ({
    // Initial state
    isDialogOpen: false,
    isCreating: false,
    error: null,
    
    // Actions
    setIsDialogOpen: (open: boolean) => set({ isDialogOpen: open }),
    
    resetError: () => set({ error: null }),
    
    createProject: async (projectName: string, onSuccess?: () => void) => {
        const { setIsDialogOpen } = get()
        
        // Validate project name
        if (!projectName || projectName.trim().length === 0) {
            set({ error: "Project name cannot be empty" })
            return
        }

        set({ isCreating: true, error: null })

        try {
            // Show Electron save dialog
            const filePath = await window.NativeZernikalos?.showSaveProjectDialog(projectName)
            
            if (!filePath) {
                // User cancelled the dialog
                set({ isCreating: false })
                return
            }

            // Create project via API
            await createProject(projectName, filePath)
            
            // Close dialog
            setIsDialogOpen(false)
            
            // Call success callback if provided (for navigation)
            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create project"
            set({ error: errorMessage })
            console.error('❌ Failed to create project:', err)
        } finally {
            set({ isCreating: false })
        }
    },
}))

