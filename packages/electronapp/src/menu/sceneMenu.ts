import {MenuItem} from "electron";
import {MenuEvents} from "./MenuEvents";

export const sceneMenu = new MenuItem({
    label: 'Scene',
    submenu: [
        {
            label: 'Bundle Scene',
            click: (menuItem, browserWindow, event) => {
                browserWindow?.emit(MenuEvents.BUNDLE_SCENE)
            }
        },
    ]
})
