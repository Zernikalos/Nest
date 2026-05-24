import {contextBridge, ipcRenderer} from "electron"
import {RendererMenuEvents} from "./menu/MenuEvents";
import {NestEvents} from "./NestEvents";
import type {ImportFileFormat} from "./dialogs/importFileDialog";

type ElectronPlatform = 'darwin' | 'win32' | 'linux';

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
    getApiBaseUrl: () => ipcRenderer.invoke('get-api-url') as Promise<string>,
    getPlatform: (): ElectronPlatform => process.platform as ElectronPlatform,
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
    handleOpenProject: (callback: any) => {
        ipcRenderer.on(RendererMenuEvents.OPEN_PROJECT, callback)
        return {
            off: () => ipcRenderer.removeListener(RendererMenuEvents.OPEN_PROJECT, callback)
        }
    },
    handleWindowMaximizedChanged: (callback: (ev: unknown, maximized: boolean) => void) => {
        const channel = 'window:maximized-changed';
        ipcRenderer.on(channel, callback);
        return {
            off: () => ipcRenderer.removeListener(channel, callback),
        };
    },

    sendMenuContext: (context: { projectOpen: boolean }) => {
        ipcRenderer.send('ide:menuContext', context)
    },

    windowMinimize: () => ipcRenderer.invoke('window:minimize'),
    windowMaximize: () => ipcRenderer.invoke('window:maximize'),
    windowClose: () => ipcRenderer.invoke('window:close'),
    windowIsMaximized: () => ipcRenderer.invoke('window:isMaximized') as Promise<boolean>,
    windowSetBackgroundColor: (color: string) =>
        ipcRenderer.invoke('window:setBackgroundColor', color),

    menuLoadZko: () => ipcRenderer.invoke('menu:loadZko'),
    menuImportFile: (format: ImportFileFormat) => ipcRenderer.invoke('menu:importFile', format),

    actionSaveFile: (fileData: Uint8Array) => ipcRenderer.invoke(NestEvents.SAVE_FILE, fileData),
    showSaveProjectDialog: (projectName: string) => ipcRenderer.invoke(NestEvents.SHOW_SAVE_PROJECT_DIALOG, projectName),
    showOpenProjectDialog: () => ipcRenderer.invoke(NestEvents.SHOW_OPEN_PROJECT_DIALOG),
    storageGet: (key: string) => ipcRenderer.invoke('ide-storage:get', key),
    storageSet: (key: string, value: string) => ipcRenderer.invoke('ide-storage:set', key, value),
    storageDelete: (key: string) => ipcRenderer.invoke('ide-storage:delete', key),
    getAppSettings: () => ipcRenderer.invoke('userSettings:getAll'),
    patchAppSettings: (partial: Record<string, unknown>) =>
        ipcRenderer.invoke('userSettings:patch', partial),
})
