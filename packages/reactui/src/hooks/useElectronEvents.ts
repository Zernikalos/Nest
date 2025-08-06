import { useCallback, useRef } from 'react'

const isElectron = typeof window !== 'undefined' && window.NativeZernikalos

export const useElectronEvents = () => {
    const registeredCallbacks = useRef<Set<string>>(new Set())

    const onLoadZko = useCallback((callback: (data: any) => void) => {
        if (isElectron && !registeredCallbacks.current.has('loadZko')) {
            console.log("🔄 Registering LoadZko callback")
            window.NativeZernikalos?.handleLoadZko((ev: any, data: any) => {
                console.log("📁 LoadZko callback triggered", { ev, data })
                callback(data)
            })
            registeredCallbacks.current.add('loadZko')
        }
    }, [])

    const onImportFile = useCallback((callback: (data: any) => void) => {
        if (isElectron && !registeredCallbacks.current.has('importFile')) {
            console.log("🔄 Registering ImportFile callback")
            window.NativeZernikalos?.handleShowImport((ev: any, data: any) => {
                console.log("📁 ImportFile callback triggered", { ev, data })
                callback(data)
            })
            registeredCallbacks.current.add('importFile')
        }
    }, [])

    const onBundleScene = useCallback((callback: (data: any) => void) => {
        if (isElectron && !registeredCallbacks.current.has('bundleScene')) {
            console.log("🔄 Registering BundleScene callback")
            window.NativeZernikalos?.handleBundleScene((ev: any, data: any) => {
                console.log("📦 BundleScene callback triggered", { ev, data })
                callback(data)
            })
            registeredCallbacks.current.add('bundleScene')
        }
    }, [])

    return {
        onLoadZko,
        onImportFile,
        onBundleScene,
        isElectron
    }
} 