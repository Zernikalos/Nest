import { useCallback, useRef } from 'react'
import type { ElectronSubscription } from '../types/electron'

const isElectron = typeof window !== 'undefined' && window.NativeZernikalos

export const useElectronEvents = () => {
    const subscriptions = useRef<Map<string, ElectronSubscription>>(new Map())

    const onLoadZko = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('loadZko')) {
            console.log("🔄 useElectronEvents - Registering LoadZko callback")
            const subscription = window.NativeZernikalos?.handleLoadZko((ev: any, data: any) => {
                console.log("📁 LoadZko callback triggered", { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('loadZko', subscription)
            }
        }
    }, [])

    const onImportFile = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('importFile')) {
            console.log("🔄 useElectronEvents - Registering ImportFile callback")
            const subscription = window.NativeZernikalos?.handleShowImport((ev: any, data: any) => {
                console.log("📁 ImportFile callback triggered", { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('importFile', subscription)
            }
        }
    }, [])

    const onBundleScene = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('bundleScene')) {
            console.log("🔄 useElectronEvents - Registering BundleScene callback")
            const subscription = window.NativeZernikalos?.handleBundleScene((ev: any, data: any) => {
                console.log("📦 BundleScene callback triggered", { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('bundleScene', subscription)
            }
        }
    }, [])

    // Funciones para hacer off
    const offLoadZko = useCallback(() => {
        const subscription = subscriptions.current.get('loadZko')
        subscription?.off()
        subscriptions.current.delete('loadZko')
        console.log("🔄 useElectronEvents - Removed LoadZko callback")
    }, [])

    const offImportFile = useCallback(() => {
        const subscription = subscriptions.current.get('importFile')
        subscription?.off()
        subscriptions.current.delete('importFile')
        console.log("🔄 useElectronEvents - Removed ImportFile callback")
    }, [])

    const offBundleScene = useCallback(() => {
        const subscription = subscriptions.current.get('bundleScene')
        subscription?.off()
        subscriptions.current.delete('bundleScene')
        console.log("🔄 useElectronEvents - Removed BundleScene callback")
    }, [])

    return {
        onLoadZko,
        onImportFile,
        onBundleScene,
        offLoadZko,
        offImportFile,
        offBundleScene,
        isElectron
    }
} 