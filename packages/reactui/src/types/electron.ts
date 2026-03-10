declare global {
    interface Window {
        NativeZernikalos?: {
            handleLoadZko: (callback: (ev: any, data: any) => void) => ElectronSubscription
            handleShowImport: (callback: (ev: any, data: any) => void) => ElectronSubscription
            handleBundleScene: (callback: (ev: any, data: any) => void) => ElectronSubscription
            handleCreateProject: (callback: (ev: any) => void) => ElectronSubscription
            handleOpenProject: (callback: (ev: any, data: any) => void) => ElectronSubscription
            sendMenuContext: (context: MenuContextSnapshot) => void
            actionSaveFile: (fileData: Uint8Array) => void
            showSaveProjectDialog: (projectName: string) => Promise<string | null>
            showOpenProjectDialog: () => Promise<string | null>
        }
        userSettings?: {
            get: (key: string) => Promise<any>
            set: (key: string, value: any) => Promise<void>
        }
    }
}

export type ElectronEventCallback = (ev: any, data: any) => void
export type ElectronSubscription = { off: () => void }

/** Snapshot sent to main process for dynamic menu enable/disable (Phase 4). */
export interface MenuContextSnapshot {
    projectOpen: boolean
} 