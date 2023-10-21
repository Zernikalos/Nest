import {MenuItem} from "electron"
import {Constants} from "../constants";
import {MenuEvents} from "./MenuEvents";

export const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
        {
            label: "Import file...",
            submenu: [
                {
                    label: "Import GLTF (.gltf, .glb)",
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
                }
            ],
        },
        {type: 'separator'},
        Constants.isMac ? { role: 'close' } : { role: 'quit' },
    ]
})

