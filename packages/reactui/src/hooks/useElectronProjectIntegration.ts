import { useEffect } from 'react'
import { useElectronEvents } from '@/providers/Electron'
import { useAssetToZko } from './useAssetToZko'
import { useBundleScene } from './useBundleScene'
import { useProject } from './useProject'
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { useZkoStore } from '@/stores/useZkoStore'
import { useNavigate } from '@/keepaliverouter'
import { createLogger } from '@/logger'

const integrationLogger = createLogger('electron:integration')

/**
 * Hook that integrates Electron events with project management hooks.
 * Should be called once at the app root level, but after KeepAliveRouterProvider.
 */
export function useElectronProjectIntegration() {
    const { onImportFile, offImportFile, isElectron, onBundleScene, offBundleScene, onCreateProject, offCreateProject, onOpenProject, offOpenProject } = useElectronEvents()
    const { convertAssetToZko } = useAssetToZko()
    const { saveBundle } = useBundleScene()
    const { openProject } = useProject()
    const navigate = useNavigate()
    const { setIsCreateDialogOpen } = useProjectUIStore()
    const { setError } = useZkoStore()
    
    // Asset conversion listener
    useEffect(() => {
        if (isElectron) {
            const handler = async (data: any) => {
                await convertAssetToZko(data)
            }
            onImportFile(handler)
            console.log('✅ Asset conversion callback registered successfully')
            
            return () => {
                offImportFile()
            }
        } else {
            setError("Asset conversion only available in Electron environment")
        }
    }, [isElectron, onImportFile, offImportFile, convertAssetToZko, setError])
    
    // Bundle scene listener
    useEffect(() => {
        if (isElectron) {
            const handler = async () => {
                try {
                    integrationLogger.debug('Bundle scene event received')
                    await saveBundle()
                } catch (error) {
                    integrationLogger.error('Failed to bundle scene', { error })
                    setError('Failed to bundle scene. Please try again.')
                }
            }
            onBundleScene(handler)
            return () => {
                offBundleScene()
            }
        }
    }, [isElectron, onBundleScene, offBundleScene, saveBundle, setError])
    
    // Create project listener
    useEffect(() => {
        if (isElectron) {
            onCreateProject(() => {
                setIsCreateDialogOpen(true)
            })
            return () => {
                offCreateProject()
            }
        }
    }, [isElectron, onCreateProject, offCreateProject, setIsCreateDialogOpen])

    // Open project listener
    useEffect(() => {
        if (isElectron) {
            const handler = async (data: { filePath: string }) => {
                try {
                    // Open project (now uses ProjectManager internally)
                    await openProject(data.filePath)
                    
                    // Navigate to projects page (which will show ProjectEditView if project is open)
                    navigate("/projects")
                } catch (error) {
                    console.error('Failed to open project:', error)
                    // TODO: Show error notification
                }
            }
            onOpenProject(handler)
            return () => {
                offOpenProject()
            }
        }
    }, [isElectron, onOpenProject, offOpenProject, openProject, navigate])
}

