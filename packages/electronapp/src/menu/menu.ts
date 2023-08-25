import {app, Menu} from "electron"
import {Constants} from "../constants"
import {fileMenu} from "./fileMenu"
import {sceneMenu} from "./sceneMenu";

const template = [
    // { role: 'appMenu' }
    ...(Constants.isMac
        ? [{
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
                { role: 'quit' }
            ]
        }]
        : []),
    // { role: 'fileMenu' }
    fileMenu,
    sceneMenu,
    // { role: 'editMenu' }
    // {
    //     label: 'Edit',
    //     submenu: [
    //         { role: 'undo' },
    //         { role: 'redo' },
    //         { type: 'separator' },
    //         { role: 'cut' },
    //         { role: 'copy' },
    //         { role: 'paste' },
    //         ...(isMac
    //             ? [
    //                 { role: 'pasteAndMatchStyle' },
    //                 { role: 'delete' },
    //                 { role: 'selectAll' },
    //                 { type: 'separator' },
    //                 {
    //                     label: 'Speech',
    //                     submenu: [
    //                         { role: 'startSpeaking' },
    //                         { role: 'stopSpeaking' }
    //                     ]
    //                 }
    //             ]
    //             : [
    //                 { role: 'delete' },
    //                 { type: 'separator' },
    //                 { role: 'selectAll' }
    //             ])
    //     ]
    // },
    // { role: 'viewMenu' }
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
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(Constants.isMac
                ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ]
                : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
]

export function createMenu() {
    //@ts-ignore
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
}
