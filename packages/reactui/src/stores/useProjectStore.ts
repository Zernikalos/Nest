import { create } from 'zustand'
import type { ProjectMetadata } from '@/lib/projectApi'

interface ProjectState {
    projectId: string | null
    projectFilePath: string | null
    projectMetadata: ProjectMetadata | null
}

interface ProjectActions {
    setProject: (id: string, filePath: string, metadata: ProjectMetadata) => void
    clearProject: () => void
}

export const useProjectStore = create<ProjectState & ProjectActions>((set) => ({
    projectId: null,
    projectFilePath: null,
    projectMetadata: null,
    
    setProject: (id, filePath, metadata) => set({ 
        projectId: id, 
        projectFilePath: filePath, 
        projectMetadata: metadata 
    }),
    
    clearProject: () => set({ 
        projectId: null, 
        projectFilePath: null, 
        projectMetadata: null 
    }),
}))

