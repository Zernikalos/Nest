import {MenuItem} from "electron"
import {Constants} from "../constants";
import {MenuEvents} from "./MenuEvents";

export const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
        {
            label: 'Import file...',
            click: (menuItem, browserWindow, event) => {
                browserWindow?.emit(MenuEvents.IMPORT_FILE)
            }
        },
        {type: 'separator'},
        Constants.isMac ? { role: 'close' } : { role: 'quit' },
    ]
})

