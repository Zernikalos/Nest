import {MenuItem} from "electron"
import {Constants} from "../constants";

export const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
        {
            label: 'Import file...',
            click: (menuItem, browserWindow, event) => {
                browserWindow?.emit("import-file")
            }
        },
        {type: 'separator'},
        Constants.isMac ? { role: 'close' } : { role: 'quit' },
    ]
})

