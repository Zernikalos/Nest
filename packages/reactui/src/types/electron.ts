declare global {
    interface Window {
        NativeZernikalos?: {
            handleLoadZko: (callback: (ev: any, data: any) => void) => void
            handleShowImport: (callback: (ev: any, data: any) => void) => void
            handleBundleScene: (callback: (ev: any, data: any) => void) => void
            actionSaveFile: (fileData: Uint8Array) => void
        }
        userSettings?: {
            get: (key: string) => Promise<any>
            set: (key: string, value: any) => Promise<void>
        }
    }
}

export type ElectronEventCallback = (ev: any, data: any) => void 