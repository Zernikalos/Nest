declare global {
    interface Window {
        NativeZernikalos?: {
            handleLoadZko: (callback: (data: any) => void) => void
            handleShowImport: (callback: (data: any) => void) => void
            handleBundleScene: (callback: (data: any) => void) => void
            actionSaveFile: (fileData: Uint8Array) => void
        }
        userSettings?: {
            get: (key: string) => Promise<any>
            set: (key: string, value: any) => Promise<void>
        }
    }
}

export type ElectronEventCallback = (data: any) => void 