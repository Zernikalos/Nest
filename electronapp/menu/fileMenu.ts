import {MenuItem} from "electron"
import {Constants} from "../constants"
import {MenuEvents} from "./MenuEvents"
import {ipcMain} from "electron"

export const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
        {
            label: "Load Zko file",
            click: () => {
                ipcMain.emit(MenuEvents.LOAD_ZKO)
            }
        },
        {type: "separator"},
        {
            label: "Import file...",
            submenu: [
                {
                    label: "Import GlTF (.gltf, .glb)",
                    click: () => {
                        ipcMain.emit(MenuEvents.IMPORT_FILE, null, {format: "gltf"})
                    }
                },
                {
                    label: "Import OBJ (.obj)",
                    click: () => {
                        ipcMain.emit(MenuEvents.IMPORT_FILE, null, {format: "obj"})
                    }
                },
                {
                    label: "Import FBX (.fbx)",
                    click: () => {
                        ipcMain.emit(MenuEvents.IMPORT_FILE, null, {format: "fbx"})
                    }
                },
                {
                    label: "Import Collada (.dae)",
                    click: () => {
                        ipcMain.emit(MenuEvents.IMPORT_FILE, null, {format: "collada"})
                    }
                }
            ],
        },
        {type: 'separator'},
        Constants.isMac ? { role: 'close' } : { role: 'quit' },
    ]
})