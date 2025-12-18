import { useEffect } from 'react'
import { useElectronEvents } from '@/providers/Electron'
import { useAssetToZko } from './useAssetToZko'
import { useBundleScene } from './useBundleScene'
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { useZkoStore } from '@/stores/useZkoStore'

/**
 * Hook that integrates Electron events with project management hooks.
 * Should be called once at the app root level.
 */
export function useElectronProjectIntegration() {
    const { onImportFile, offImportFile, isElectron, onBundleScene, onCreateProject, offCreateProject } = useElectronEvents()
    const { convertAssetToZko } = useAssetToZko()
    const { saveBundle } = useBundleScene()
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
            onBundleScene(saveBundle)
        }
    }, [isElectron, onBundleScene, saveBundle])
    
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
}

