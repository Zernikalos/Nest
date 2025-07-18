import {contextBridge, ipcRenderer} from "electron"
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
    handleLoadZko: (callback: any) => ipcRenderer.on(RendererMenuEvents.LOAD_ZKO, callback),
    handleShowImport: (callback: any) => ipcRenderer.on(RendererMenuEvents.IMPORT_FILE, callback),
    handleBundleScene: (callback: any) => ipcRenderer.on(RendererMenuEvents.BUNDLE_SCENE, callback),

    actionSaveFile: (fileData: Uint8Array) => ipcRenderer.send(NestEvents.SAVE_FILE, fileData),

    createNewProject: () => ipcRenderer.invoke('NEW_PROJECT'),
})

contextBridge.exposeInMainWorld('userSettings', {
    get: (key: string) => {
        return ipcRenderer.invoke("userSettings:get", key)
    },
    set: (key: string, value: any) => {
        return ipcRenderer.invoke("userSettings:set", key, value)
    },
});
