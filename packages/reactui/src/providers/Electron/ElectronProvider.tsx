import { createContext, useCallback, useRef, type ReactNode, useEffect } from 'react'
import type { ElectronSubscription } from '../../types/electron'
import { createLogger, LogLevel } from '../../logger'

interface ElectronProviderState {
    onLoadZko: (callback: (data: any) => void) => void
    onImportFile: (callback: (data: any) => void) => void
    onBundleScene: (callback: (data: any) => void) => void
    onCreateProject: (callback: () => void) => void
    onOpenProject: (callback: (data: { filePath: string }) => void) => void
    offLoadZko: () => void
    offImportFile: () => void
    offBundleScene: () => void
    offCreateProject: () => void
    offOpenProject: () => void
    isElectron: boolean
}

const initialState: ElectronProviderState = {
    onLoadZko: () => null,
    onImportFile: () => null,
    onBundleScene: () => null,
    onCreateProject: () => null,
    onOpenProject: () => null,
    offLoadZko: () => null,
    offImportFile: () => null,
    offBundleScene: () => null,
    offCreateProject: () => null,
    offOpenProject: () => null,
    isElectron: false
}

const ElectronProviderContext = createContext<ElectronProviderState>(initialState)

const isElectron = typeof window !== 'undefined' && window.NativeZernikalos !== undefined

// Logger for Electron provider
const electronLogger = createLogger('electron:provider')

export function ElectronProvider({ children, ...props }: { children: ReactNode }) {
    const subscriptions = useRef<Map<string, ElectronSubscription>>(new Map())

    const onLoadZko = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('loadZko')) {
            electronLogger.debug('Registering LoadZko callback')
            const subscription = window.NativeZernikalos?.handleLoadZko((ev: any, data: any) => {
                electronLogger.debug('LoadZko callback triggered', { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('loadZko', subscription)
            }
        }
    }, [])

    const onImportFile = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('importFile')) {
            electronLogger.debug('Registering ImportFile callback')
            const subscription = window.NativeZernikalos?.handleShowImport((ev: any, data: any) => {
                electronLogger.debug('ImportFile callback triggered', { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('importFile', subscription)
            }
        }
    }, [])

    const onBundleScene = useCallback((callback: (data: any) => void) => {
        if (isElectron && !subscriptions.current.has('bundleScene')) {
            electronLogger.debug('Registering BundleScene callback')
            const subscription = window.NativeZernikalos?.handleBundleScene((ev: any, data: any) => {
                electronLogger.debug('BundleScene callback triggered', { ev, data })
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
        electronLogger.debug('Removed LoadZko callback')
    }, [])

    const offImportFile = useCallback(() => {
        const subscription = subscriptions.current.get('importFile')
        subscription?.off()
        subscriptions.current.delete('importFile')
        electronLogger.debug('Removed ImportFile callback')
    }, [])

    const offBundleScene = useCallback(() => {
        const subscription = subscriptions.current.get('bundleScene')
        subscription?.off()
        subscriptions.current.delete('bundleScene')
        electronLogger.debug('Removed BundleScene callback')
    }, [])

    const onCreateProject = useCallback((callback: () => void) => {
        if (isElectron && !subscriptions.current.has('createProject')) {
            electronLogger.debug('Registering CreateProject callback')
            const subscription = window.NativeZernikalos?.handleCreateProject?.((ev: any) => {
                electronLogger.debug('CreateProject callback triggered', { ev })
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
        electronLogger.debug('Removed CreateProject callback')
    }, [])

    const onOpenProject = useCallback((callback: (data: { filePath: string }) => void) => {
        if (isElectron && !subscriptions.current.has('openProject')) {
            electronLogger.debug('Registering OpenProject callback')
            const subscription = window.NativeZernikalos?.handleOpenProject?.((ev: any, data: any) => {
                electronLogger.debug('OpenProject callback triggered', { ev, data })
                callback(data)
            })
            if (subscription) {
                subscriptions.current.set('openProject', subscription)
            }
        }
    }, [])

    const offOpenProject = useCallback(() => {
        const subscription = subscriptions.current.get('openProject')
        subscription?.off()
        subscriptions.current.delete('openProject')
        electronLogger.debug('Removed OpenProject callback')
    }, [])

    // Cleanup cuando se desmonta el provider
    useEffect(() => {
        return () => {
            offLoadZko()
            offImportFile()
            offBundleScene()
            offCreateProject()
            offOpenProject()
        }
    }, [offLoadZko, offImportFile, offBundleScene, offCreateProject, offOpenProject])

    const value: ElectronProviderState = {
        onLoadZko,
        onImportFile,
        onBundleScene,
        onCreateProject,
        onOpenProject,
        offLoadZko,
        offImportFile,
        offBundleScene,
        offCreateProject,
        offOpenProject,
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
