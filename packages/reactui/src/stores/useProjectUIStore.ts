import { create } from 'zustand'

interface ProjectUIState {
    isCreateDialogOpen: boolean
    isCreating: boolean
    creationError: string | null
}

interface ProjectUIActions {
    setIsCreateDialogOpen: (open: boolean) => void
    setCreating: (creating: boolean) => void
    setCreationError: (error: string | null) => void
}

export const useProjectUIStore = create<ProjectUIState & ProjectUIActions>((set) => ({
    isCreateDialogOpen: false,
    isCreating: false,
    creationError: null,
    
    setIsCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
    setCreating: (creating) => set({ isCreating: creating }),
    setCreationError: (error) => set({ creationError: error }),
}))

