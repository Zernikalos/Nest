import { useCallback } from 'react'
import { useZkoStore } from '@/stores/useZkoStore'
import { zkExport } from '@zernikalos/zkbuilder'
import { createLogger } from '@/logger'
import _ from 'lodash'

const bundleSceneLogger = createLogger('electron:bundle-scene')

export function useBundleScene() {
    const { zkResult } = useZkoStore()
    
    const bundleScene = useCallback(async (): Promise<Uint8Array | undefined> => {
        if (_.isNil(zkResult)) {
            return undefined
        }
        return await zkExport(zkResult.zko, { format: "proto" }) as Uint8Array
    }, [zkResult])
    
    const saveBundle = useCallback(async () => {
        if (_.isNil(zkResult)) {
            bundleSceneLogger.warn('Cannot bundle scene: no ZKO result available')
            return
        }
        try {
            bundleSceneLogger.debug('Starting bundle scene export')
            const bundled = await bundleScene()
            if (bundled) {
                bundleSceneLogger.debug('Bundle scene exported successfully', { size: bundled.length })
                await window.NativeZernikalos?.actionSaveFile(bundled)
                bundleSceneLogger.debug('Bundle scene save dialog triggered')
            } else {
                bundleSceneLogger.warn('Bundle scene returned undefined')
            }
        } catch (error) {
            bundleSceneLogger.error('Error bundling scene', { error })
            throw error
        }
    }, [bundleScene, zkResult])
    
    return {
        bundleScene,
        saveBundle,
        canBundle: zkResult !== null,
    }
}

