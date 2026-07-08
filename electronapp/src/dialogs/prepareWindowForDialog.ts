import type { BrowserWindow } from 'electron';

/** Ensures a frameless parent window is focused before showing a native file dialog (Windows). */
export async function prepareWindowForDialog(browserWindow: BrowserWindow): Promise<void> {
    if (browserWindow.isMinimized()) {
        browserWindow.restore();
    }
    browserWindow.show();
    browserWindow.focus();
}
