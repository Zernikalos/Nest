import { useEffect } from 'react'
import { useElectronEvents } from '@/providers/Electron'
import {
    useIdeCore,
    FILE_LOAD_ZKO,
    FILE_IMPORT_FILE,
    FILE_BUNDLE_SCENE,
    FILE_CREATE_PROJECT,
    FILE_OPEN_PROJECT,
} from '@/ideCore'
import type { AssetConversionData } from '@/types/project'
import { useAssetToZko } from './useAssetToZko'
import { useBundleScene } from './useBundleScene'
import { useProject } from './useProject'
import { useProjectUIStore } from '@/stores/useProjectUIStore'
import { useZkoStore } from '@/stores/useZkoStore'
import { useNavigate } from '@/keepaliverouter'
import { createLogger } from '@/logger'

const integrationLogger = createLogger('electron:integration')

/**
 * Hook that integrates Electron events with project management via runtime commands.
 * Registers commands in CommandService and wires IPC events to executeCommand.
 * Should be called once at the app root level, but after KeepAliveRouterProvider and IdeCoreProvider.
 */
export function useElectronProjectIntegration() {
    const {
        onLoadZko,
        offLoadZko,
        onImportFile,
        offImportFile,
        onBundleScene,
        offBundleScene,
        onCreateProject,
        offCreateProject,
        onOpenProject,
        offOpenProject,
        isElectron,
    } = useElectronEvents()
    const { executeCommand, registerCommand, unregisterCommand, contextKey } = useIdeCore()
    const { convertAssetToZko } = useAssetToZko()
    const { saveBundle } = useBundleScene()
    const { openProject } = useProject()
    const navigate = useNavigate()
    const { setIsCreateDialogOpen } = useProjectUIStore()
    const { setError } = useZkoStore()

    // Register commands with handlers that call existing logic
    useEffect(() => {
        registerCommand(FILE_LOAD_ZKO, () => {
            // Placeholder: no handler currently; Load Zko can be wired when behavior is defined
        })

        registerCommand(FILE_IMPORT_FILE, (payload) => {
            convertAssetToZko(payload as AssetConversionData).catch(() =>
                setError('Asset conversion only available in Electron environment')
            )
        })

        registerCommand(FILE_BUNDLE_SCENE, () => {
            saveBundle().catch((error) => {
                integrationLogger.error('Failed to bundle scene', { error })
                setError('Failed to bundle scene. Please try again.')
            })
        })

        registerCommand(FILE_CREATE_PROJECT, () => {
            setIsCreateDialogOpen(true)
        })

        registerCommand(FILE_OPEN_PROJECT, (payload) => {
            const { filePath } = payload as { filePath: string }
            openProject(filePath)
                .then(() => {
                    contextKey.set('projectOpen', true)
                    window.NativeZernikalos?.sendMenuContext?.({ projectOpen: true })
                    navigate('/projects')
                })
                .catch((error) => {
                    console.error('Failed to open project:', error)
                })
        })
        return () => {
            unregisterCommand(FILE_LOAD_ZKO)
            unregisterCommand(FILE_IMPORT_FILE)
            unregisterCommand(FILE_BUNDLE_SCENE)
            unregisterCommand(FILE_CREATE_PROJECT)
            unregisterCommand(FILE_OPEN_PROJECT)
        }
    }, [
        registerCommand,
        unregisterCommand,
        convertAssetToZko,
        saveBundle,
        setIsCreateDialogOpen,
        openProject,
        navigate,
        setError,
        contextKey,
    ])

    // Wire IPC events to CommandService
    useEffect(() => {
        if (!isElectron) return

        onLoadZko((data) => executeCommand(FILE_LOAD_ZKO, data))
        onImportFile((data) => executeCommand(FILE_IMPORT_FILE, data))
        onBundleScene(() => executeCommand(FILE_BUNDLE_SCENE))
        onCreateProject(() => executeCommand(FILE_CREATE_PROJECT))
        onOpenProject((data) => executeCommand(FILE_OPEN_PROJECT, data))

        return () => {
            offLoadZko()
            offImportFile()
            offBundleScene()
            offCreateProject()
            offOpenProject()
        }
    }, [
        isElectron,
        onLoadZko,
        offLoadZko,
        onImportFile,
        offImportFile,
        onBundleScene,
        offBundleScene,
        onCreateProject,
        offCreateProject,
        onOpenProject,
        offOpenProject,
        executeCommand,
    ])

    // Sync menu context to main process for dynamic enable/disable (Phase 4)
    useEffect(() => {
        if (!isElectron) return
        const projectOpen = contextKey.getBool('projectOpen')
        window.NativeZernikalos?.sendMenuContext?.({ projectOpen })
    }, [isElectron, contextKey])
}
