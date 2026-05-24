import { BrowserWindow, ipcMain } from 'electron';

const MAXIMIZED_CHANGED = 'window:maximized-changed';

export function registerWindowControlHandlers(getWindow: () => BrowserWindow | undefined): void {
    ipcMain.handle('window:minimize', () => {
        getWindow()?.minimize();
    });

    ipcMain.handle('window:maximize', () => {
        const win = getWindow();
        if (!win) return;
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    ipcMain.handle('window:close', () => {
        getWindow()?.close();
    });

    ipcMain.handle('window:isMaximized', () => {
        const win = getWindow();
        return win?.isMaximized() ?? false;
    });

    ipcMain.handle('window:setBackgroundColor', (_event, color: string) => {
        const win = getWindow();
        if (!win || typeof color !== 'string') return;
        win.setBackgroundColor(color);
    });
}

export function attachWindowMaximizeEvents(
    browserWindow: BrowserWindow,
    sendMaximized: (maximized: boolean) => void,
): void {
    const notify = () => sendMaximized(browserWindow.isMaximized());
    browserWindow.on('maximize', notify);
    browserWindow.on('unmaximize', notify);
}

export { MAXIMIZED_CHANGED };
