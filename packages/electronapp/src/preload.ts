import {contextBridge, ipcRenderer} from "electron"
import {RendererMenuEvents, MenuEvents} from "./menu/MenuEvents";
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
    handleLoadZko: (callback: any) => {
        ipcRenderer.on(RendererMenuEvents.LOAD_ZKO, callback)
        return {
            off: () => ipcRenderer.removeListener(RendererMenuEvents.LOAD_ZKO, callback)
        }
    },
    handleShowImport: (callback: any) => {
        ipcRenderer.on(RendererMenuEvents.IMPORT_FILE, callback)
        return {
            off: () => ipcRenderer.removeListener(RendererMenuEvents.IMPORT_FILE, callback)
        }
    },
    handleBundleScene: (callback: any) => {
        ipcRenderer.on(RendererMenuEvents.BUNDLE_SCENE, callback)
        return {
            off: () => ipcRenderer.removeListener(RendererMenuEvents.BUNDLE_SCENE, callback)
        }
    },
    handleCreateProject: (callback: any) => {
        ipcRenderer.on(RendererMenuEvents.CREATE_PROJECT, callback)
        return {
            off: () => ipcRenderer.removeListener(RendererMenuEvents.CREATE_PROJECT, callback)
        }
    },

    actionSaveFile: (fileData: Uint8Array) => ipcRenderer.invoke(NestEvents.SAVE_FILE, fileData),
    showSaveProjectDialog: (projectName: string) => ipcRenderer.invoke(NestEvents.SHOW_SAVE_PROJECT_DIALOG, projectName),
})

contextBridge.exposeInMainWorld('userSettings', {
    get: (key: string) => {
        return ipcRenderer.invoke("userSettings:get", key)
    },
    set: (key: string, value: any) => {
        return ipcRenderer.invoke("userSettings:set", key, value)
    },
});
