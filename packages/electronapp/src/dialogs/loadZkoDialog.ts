import {BrowserWindow, dialog} from "electron";

export function loadZkoDialog(browserWindow: BrowserWindow) {
    return dialog.showOpenDialog(browserWindow,{
        title: "Load Zko file",
        buttonLabel: "Load",
        filters: [
            { name: 'Zko', extensions: ['zko'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    })
}