import { create } from 'zustand'

interface ProjectState {
    projectFilePath: string | null
}

interface ProjectActions {
    setProjectPath: (filePath: string) => void
    clearProjectPath: () => void
}

export const useProjectStore = create<ProjectState & ProjectActions>((set) => ({
    projectFilePath: null,
    
    setProjectPath: (filePath) => set({ 
        projectFilePath: filePath
    }),
    
    clearProjectPath: () => set({ 
        projectFilePath: null
    }),
}))

