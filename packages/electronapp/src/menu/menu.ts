import { app, Menu } from "electron"
import { Constants } from "../constants"
import { getFileMenuTemplate } from "./fileMenu"
import { getSceneMenuTemplate } from "./sceneMenu"
import { editMenu } from "./editMenu"
import { DEFAULT_MENU_CONTEXT, type MenuContextSnapshot } from "./MenuContext"

export function createMenu(context: MenuContextSnapshot = DEFAULT_MENU_CONTEXT): Electron.Menu {
    const ctx = context ?? DEFAULT_MENU_CONTEXT
    const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
        ...(Constants.isMac
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
                ...(Constants.isMac
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
    Menu.setApplicationMenu(menu)
    return menu
}
