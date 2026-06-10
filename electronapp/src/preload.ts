import { contextBridge, ipcRenderer } from 'electron';
import { HostPlatform } from '@ide-core';
import {
    createHostDialogsPreloadBridge,
    IdeIpcChannel,
    type MenuContextSnapshot,
} from '@ide-core/electron';

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency] ?? '');
    }
});

const hostDialogs = createHostDialogsPreloadBridge((channel, ...args) =>
    ipcRenderer.invoke(channel, ...args),
);

contextBridge.exposeInMainWorld('NativeZernikalos', {
    ...hostDialogs,
    getApiBaseUrl: () => ipcRenderer.invoke('get-api-url') as Promise<string>,
    getPlatform: (): HostPlatform => process.platform as HostPlatform,
    onExecuteCommand: (callback: (...args: unknown[]) => void) => {
        const channel = IdeIpcChannel.ExecuteCommand;
        ipcRenderer.on(channel, callback);
        return {
            off: () => ipcRenderer.removeListener(channel, callback),
        };
    },
    handleWindowMaximizedChanged: (callback: (ev: unknown, maximized: boolean) => void) => {
        const channel = 'window:maximized-changed';
        ipcRenderer.on(channel, callback);
        return {
            off: () => ipcRenderer.removeListener(channel, callback),
        };
    },
    sendMenuContext: (context: MenuContextSnapshot) => {
        ipcRenderer.send(IdeIpcChannel.MenuContext, context);
    },
    windowMinimize: () => ipcRenderer.invoke('window:minimize'),
    windowMaximize: () => ipcRenderer.invoke('window:maximize'),
    windowClose: () => ipcRenderer.invoke('window:close'),
    windowIsMaximized: () => ipcRenderer.invoke('window:isMaximized') as Promise<boolean>,
    windowSetBackgroundColor: (color: string) =>
        ipcRenderer.invoke('window:setBackgroundColor', color),
    storageGet: (key: string) => ipcRenderer.invoke('ide-storage:get', key),
    storageSet: (key: string, value: string) => ipcRenderer.invoke('ide-storage:set', key, value),
    storageDelete: (key: string) => ipcRenderer.invoke('ide-storage:delete', key),
    getAppSettings: () => ipcRenderer.invoke('userSettings:getAll'),
    patchAppSettings: (partial: Record<string, unknown>) =>
        ipcRenderer.invoke('userSettings:patch', partial),
});
