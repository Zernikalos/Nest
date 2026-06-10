import { app, shell } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';
import { getPlatformProfile, MenuPresentation } from '../platform/platformProfile';

/** macOS application menu (About, Services, Quit, …). */
export function buildMacAppMenu(): MenuItemConstructorOptions | null {
    if (getPlatformProfile().menuPresentation !== MenuPresentation.Native) {
        return null;
    }
    return {
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    };
}

/** Platform chrome menus appended after the app manifest groups. */
export function buildShellMenuSuffix(): MenuItemConstructorOptions[] {
    const profile = getPlatformProfile();
    return [
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(profile.menuPresentation === MenuPresentation.Native
                    ? [
                          { type: 'separator' as const },
                          { role: 'front' as const },
                          { type: 'separator' as const },
                          { role: 'window' as const },
                      ]
                    : [{ role: 'close' as const }]),
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://zernikalos.dev');
                    },
                },
            ],
        },
    ];
}
