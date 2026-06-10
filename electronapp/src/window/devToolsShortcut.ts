import { BrowserWindow } from 'electron';
import { getPlatformProfile, MenuPresentation } from '../platform/platformProfile';

function isToggleDevToolsInput(input: Electron.Input): boolean {
    if (input.type !== 'keyDown') return false;
    if (input.key === 'F12') return true;
    return input.control && input.shift && input.key.toLowerCase() === 'i';
}

/**
 * Registers DevTools keyboard shortcuts on platforms that use in-renderer chrome
 * instead of a native app menu (Windows/Linux). macOS exposes toggleDevTools via
 * the native View menu.
 */
export function attachDevToolsShortcut(browserWindow: BrowserWindow): void {
    if (getPlatformProfile().menuPresentation !== MenuPresentation.InRenderer) return;

    const { webContents } = browserWindow;
    webContents.on('before-input-event', (event, input) => {
        if (!isToggleDevToolsInput(input)) return;
        event.preventDefault();
        webContents.toggleDevTools();
    });
}
