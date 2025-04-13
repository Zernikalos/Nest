interface NativeZernikalos {
    handleLoadZko(callback: (ev: string, payload: { path: string; fileName: string }) => Promise<void>): void
    handleShowImport(callback: (ev: string, payload: {path: string, fileName: string, format:  "obj" | "gltf" | "fbx" | "collada" | undefined}) => Promise<void>): void
    handleBundleScene(callback: (ev: string, _payload: {path: string, fileName: string}) => Promise<void>): void
    actionSaveFile(data: Uint8Array | undefined): void
}

interface Window {
    NativeZernikalos: NativeZernikalos
}