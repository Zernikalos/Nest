import { ipcMain } from "electron"
import { MenuEvents } from "./MenuEvents"
import type { MenuContextSnapshot } from "./MenuContext"

export function getSceneMenuTemplate(context: MenuContextSnapshot): Electron.MenuItemConstructorOptions {
    return {
        label: 'Scene',
        submenu: [
            {
                label: 'Bundle Scene',
                enabled: context.projectOpen,
                click: () => {
                    ipcMain.emit(MenuEvents.BUNDLE_SCENE)
                }
            },
        ]
    }
}
