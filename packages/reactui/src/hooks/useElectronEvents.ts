import { useCallback } from 'react'

const isElectron = typeof window !== 'undefined' && window.NativeZernikalos

export const useElectronEvents = () => {
    const onLoadZko = useCallback((callback: (data: any) => void) => {
        if (isElectron) {
            window.NativeZernikalos?.handleLoadZko(callback)
        }
    }, [])

    const onImportFile = useCallback((callback: (data: any) => void) => {
        if (isElectron) {
            window.NativeZernikalos?.handleShowImport(callback)
        }
    }, [])

    const onBundleScene = useCallback((callback: (data: any) => void) => {
        if (isElectron) {
            window.NativeZernikalos?.handleBundleScene(callback)
        }
    }, [])

    return {
        onLoadZko,
        onImportFile,
        onBundleScene,
        isElectron
    }
} 