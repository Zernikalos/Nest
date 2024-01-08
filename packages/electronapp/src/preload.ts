import {contextBridge, ipcRenderer, ipcMain} from "electron"
import {RendererMenuEvents} from "./menu/MenuEvents";
import {NestEvents} from "./NestEvents";

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector:any, text:any) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

contextBridge.exposeInMainWorld('NativeZernikalos', {
    handleShowImport: (callback: any) => ipcRenderer.on(RendererMenuEvents.IMPORT_FILE, callback),
    handleBundleScene: (callback: any) => ipcRenderer.on(RendererMenuEvents.BUNDLE_SCENE, callback),

    actionSaveFile: (fileData: Uint8Array) => ipcRenderer.send(NestEvents.SAVE_FILE, fileData)
})
