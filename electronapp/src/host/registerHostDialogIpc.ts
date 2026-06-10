import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import type { AssetFormat } from '@ide-core';
import { HostDialogIpcChannel } from '@ide-core/electron';
import { createElectronDialogHost } from './electronDialogHost';

let handlersRegistered = false;

export function registerHostDialogIpcHandlers(
    getBrowserWindow: () => BrowserWindow | undefined,
): void {
    if (handlersRegistered) return;
    handlersRegistered = true;

    const dialogs = createElectronDialogHost(getBrowserWindow);

    ipcMain.handle(HostDialogIpcChannel.LoadZko, () => dialogs.loadZko());
    ipcMain.handle(HostDialogIpcChannel.ImportFile, (_event, format: AssetFormat) =>
        dialogs.importFile(format),
    );
    ipcMain.handle(HostDialogIpcChannel.OpenProject, () => dialogs.openProject());
    ipcMain.handle(HostDialogIpcChannel.SaveProject, (_event, projectName: string) =>
        dialogs.saveProject(projectName),
    );
    ipcMain.handle(HostDialogIpcChannel.SaveBundledScene, (_event, fileData: Uint8Array) =>
        dialogs.saveBundledScene(fileData),
    );
}
