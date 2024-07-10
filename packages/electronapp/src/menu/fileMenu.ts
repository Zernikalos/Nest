import {BrowserWindow, MenuItem} from "electron"
import {Constants} from "../constants";
import {MenuEvents} from "./MenuEvents";

export const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
        {
            label: "Load Zko file",
            click: (menuItem, browserWindow) => {
                browserWindow?.emit(MenuEvents.LOAD_ZKO, {})
            }
        },
        {type: "separator"},
        {
            label: "Import file...",
            submenu: [
                {
                    label: "Import GlTF (.gltf, .glb)",
                    click: (menuItem, browserWindow) => {
                        browserWindow?.emit(MenuEvents.IMPORT_FILE, {format: "gltf"})
                    }
                },
                {
                    label: "Import OBJ (.obj)",
                    click: (menuItem, browserWindow) => {
                        browserWindow?.emit(MenuEvents.IMPORT_FILE, {format: "obj"})
                    }
                },
                {
                    label: "Import FBX (.fbx)",
                    click: (menuItem, browserWindow) => {
                        browserWindow?.emit(MenuEvents.IMPORT_FILE, {format: "fbx"})
                    }
                },
                {
                    label: "Import Collada (.dae)",
                    click: (menuItem, browserWindow) => {
                        browserWindow?.emit(MenuEvents.IMPORT_FILE, {format: "collada"})
                    }
                }
            ],
        },
        {type: 'separator'},
        Constants.isMac ? { role: 'close' } : { role: 'quit' },
    ]
})

