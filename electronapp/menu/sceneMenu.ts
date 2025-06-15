import {ipcMain, MenuItem} from "electron";
import {MenuEvents} from "./MenuEvents";

export const sceneMenu = new MenuItem({
    label: 'Scene',
    submenu: [
        {
            label: 'Bundle Scene',
            click: (menuItem, browserWindow, event) => {
                ipcMain.emit(MenuEvents.BUNDLE_SCENE)
            }
        },
    ]
})
