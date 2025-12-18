import { createContext, useCallback, useRef, type ReactNode, useEffect } from 'react'
import type { ElectronSubscription } from '../../types/electron'

interface ElectronProviderState {
    onLoadZko: (callback: (data: any) => void) => void
    onImportFile: (callback: (data: any) => void) => void
    onBundleScene: (callback: (data: any) => void) => void
    onCreateProject: (callback: () => void) => void
    offLoadZko: () => void
    offImportFile: () => void
    offBundleScene: () => void
    offCreateProject: () => void
    isElectron: boolean
}

const initialState: ElectronProviderState = {
    onLoadZko: () => null,
    onImportFile: () => null,
    onBundleScene: () => null,
    onCreateProject: () => null,
    offLoadZko: () => null,
    offImportFile: () => null,
    offBundleScene: () => null,
    offCreateProject: () => null,
    isElectron: false
}

const ElectronProviderContext = createContext<ElectronProviderState>(initialState)

const isElectron = typeof window !== 'undefined' && window.NativeZernikalos !== undefined

export function ElectronProvider({ children, ...props }: { children: ReactNode }) {
    const subscriptions = useRef<Map<string, ElectronSubscription>>(new Map())

    const onLoadZko = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('loadZko')) {
            console.log("🔄 ElectronProvider - Registering LoadZko callback")
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
            console.log("🔄 ElectronProvider - Registering ImportFile callback")
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
            console.log("🔄 ElectronProvider - Registering BundleScene callback")
            const subscription = window.NativeZernikalos?.handleBundleScene((ev: any, data: any) => {
                console.log("📦 BundleScene callback triggered", { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('bundleScene', subscription)
            }
        }
    }, [])

    const offLoadZko = useCallback(() => {
        const subscription = subscriptions.current.get('loadZko')
        subscription?.off()
        subscriptions.current.delete('loadZko')
        console.log("🔄 ElectronProvider - Removed LoadZko callback")
    }, [])

    const offImportFile = useCallback(() => {
        const subscription = subscriptions.current.get('importFile')
        subscription?.off()
        subscriptions.current.delete('importFile')
        console.log("🔄 ElectronProvider - Removed ImportFile callback")
    }, [])

    const offBundleScene = useCallback(() => {
        const subscription = subscriptions.current.get('bundleScene')
        subscription?.off()
        subscriptions.current.delete('bundleScene')
        console.log("🔄 ElectronProvider - Removed BundleScene callback")
    }, [])

    const onCreateProject = useCallback((callback: () => void) => {
        if (isElectron && !subscriptions.current.has('createProject')) {
            console.log("🔄 ElectronProvider - Registering CreateProject callback")
            const subscription = window.NativeZernikalos?.handleCreateProject?.((ev: any) => {
                console.log("📁 CreateProject callback triggered", { ev })
                callback()
            })
            if (subscription) {
                subscriptions.current.set('createProject', subscription)
            }
        }
    }, [])

    const offCreateProject = useCallback(() => {
        const subscription = subscriptions.current.get('createProject')
        subscription?.off()
        subscriptions.current.delete('createProject')
        console.log("🔄 ElectronProvider - Removed CreateProject callback")
    }, [])

    // Cleanup cuando se desmonta el provider
    useEffect(() => {
        return () => {
            offLoadZko()
            offImportFile()
            offBundleScene()
            offCreateProject()
        }
    }, [offLoadZko, offImportFile, offBundleScene, offCreateProject])

    const value: ElectronProviderState = {
        onLoadZko,
        onImportFile,
        onBundleScene,
        onCreateProject,
        offLoadZko,
        offImportFile,
        offBundleScene,
        offCreateProject,
        isElectron
    }

    return (
        <ElectronProviderContext.Provider {...props} value={value}>
            {children}
        </ElectronProviderContext.Provider>
    )
}

// Export the context for use in the hook
export { ElectronProviderContext }
