import { useCallback, useMemo } from 'react'
import { useZkoStore } from '@/stores/useZkoStore'
import { createLogger } from '@/logger'
import { ZkoManager } from '@/core/ZkoManager'
import type { ZkResultExtended } from '@/types/project'

const bundleSceneLogger = createLogger('electron:bundle-scene')

export function useBundleScene() {
    // Use singleton instance of ZkoManager
    const manager = useMemo(() => {
        return ZkoManager.getInstance()
    }, [])

    const { zkResult } = useZkoStore()
    
    const bundleScene = useCallback(async (zkResultParam: ZkResultExtended): Promise<Uint8Array> => {
        // Use manager's bundleScene method with zkResult parameter
        return await manager.bundleScene(zkResultParam)
    }, [manager])
    
    const saveBundle = useCallback(async () => {
        const currentZkResult = useZkoStore.getState().zkResult
        if (!currentZkResult) {
            bundleSceneLogger.warn('Cannot bundle scene: no ZKO result available')
            return
        }
        try {
            bundleSceneLogger.debug('Starting bundle scene export')
            const bundled = await bundleScene(currentZkResult)
            bundleSceneLogger.debug('Bundle scene exported successfully', { size: bundled.length })
            await window.NativeZernikalos?.actionSaveFile(bundled)
            bundleSceneLogger.debug('Bundle scene save dialog triggered')
        } catch (error) {
            bundleSceneLogger.error('Error bundling scene', { error })
            throw error
        }
    }, [bundleScene])
    
    return {
        bundleScene,
        saveBundle,
        canBundle: zkResult !== null,
    }
}

