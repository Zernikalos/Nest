import { useCallback } from 'react'
import { useZkoStore } from '@/stores/useZkoStore'
import { zkExport } from '@zernikalos/zkbuilder'
import _ from 'lodash'

export function useBundleScene() {
    const { zkResult } = useZkoStore()
    
    const bundleScene = useCallback(async (): Promise<Uint8Array | undefined> => {
        if (_.isNil(zkResult)) {
            return undefined
        }
        return await zkExport(zkResult.zko, { format: "proto" }) as Uint8Array
    }, [zkResult])
    
    const saveBundle = useCallback(async () => {
        const bundled = await bundleScene()
        if (bundled) {
            window.NativeZernikalos?.actionSaveFile(bundled)
        }
    }, [bundleScene])
    
    return {
        bundleScene,
        saveBundle,
        canBundle: zkResult !== null,
    }
}

