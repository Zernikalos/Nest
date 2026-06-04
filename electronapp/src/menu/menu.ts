import { app, Menu } from "electron"
import { getPlatformProfile, MenuPresentation } from "../platform/platformProfile"
import { getFileMenuTemplate } from "./fileMenu"
import { getSceneMenuTemplate } from "./sceneMenu"
import { editMenu } from "./editMenu"
import { DEFAULT_MENU_CONTEXT, type MenuContextSnapshot } from '@ide-core/electron';

export function createMenu(context: MenuContextSnapshot = DEFAULT_MENU_CONTEXT): Electron.Menu {
    const ctx = context ?? DEFAULT_MENU_CONTEXT
    const profile = getPlatformProfile()
    const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
        ...(profile.menuPresentation === MenuPresentation.Native
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' as const },
                    { type: 'separator' as const },
                    { role: 'services' as const },
                    { type: 'separator' as const },
                    { role: 'hide' as const },
                    { role: 'hideOthers' as const },
                    { role: 'unhide' as const },
                    { type: 'separator' as const },
                    { role: 'quit' as const }
                ]
            } as Electron.MenuItemConstructorOptions]
            : []),
        getFileMenuTemplate(ctx),
        editMenu,
        getSceneMenuTemplate(ctx),
        {
            label: 'View',
            submenu: [
                { role: 'reload' as const },
                { role: 'forceReload' as const },
                { role: 'toggleDevTools' as const },
                { type: 'separator' as const },
                { role: 'resetZoom' as const },
                { role: 'zoomIn' as const },
                { role: 'zoomOut' as const },
                { type: 'separator' as const },
                { role: 'togglefullscreen' as const }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' as const },
                { role: 'zoom' as const },
                ...(profile.menuPresentation === MenuPresentation.Native
                    ? [
                        { type: 'separator' as const },
                        { role: 'front' as const },
                        { type: 'separator' as const },
                        { role: 'window' as const }
                    ]
                    : [
                        { role: 'close' as const }
                    ])
            ]
        },
        {
            role: 'help' as const,
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://zernikalos.dev')
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    if (profile.menuPresentation === MenuPresentation.Native) {
        Menu.setApplicationMenu(menu)
    } else {
        Menu.setApplicationMenu(null)
    }
    return menu
}

/** Clears native menu on platforms that use in-renderer chrome. */
export function clearApplicationMenu(): void {
    if (getPlatformProfile().menuPresentation !== MenuPresentation.Native) {
        Menu.setApplicationMenu(null)
    }
}
