import { useCallback } from 'react'
import { useNavigate } from "@/keepaliverouter"
import { useProject } from './useProject'

export function useOpenProject() {
    const navigate = useNavigate()
    const { openProject } = useProject()
    
    const handleOpen = useCallback(async () => {
        try {
            // Show Electron dialog
            const filePath = await window.NativeZernikalos?.showOpenProjectDialog()
            
            if (!filePath) {
                return
            }
            
            // Open project (now just sets the path, React Query will fetch automatically)
            openProject(filePath)
            
            // Navigate to projects page (which will show ProjectEditView if project is open)
            navigate("/projects")
        } catch (error) {
            console.error('Failed to open project:', error)
            // TODO: Show error notification
        }
    }, [openProject, navigate])
    
    return {
        handleOpen,
    }
}

