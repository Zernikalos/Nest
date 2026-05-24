import {Constants} from "../constants"
import {MenuEvents} from "./MenuEvents"
import {ipcMain} from "electron"
import type { MenuContextSnapshot } from "./MenuContext"

export function getFileMenuTemplate(context: MenuContextSnapshot): Electron.MenuItemConstructorOptions {
    const projectOpen = context.projectOpen
    return {
        label: 'File',
        submenu: [
            {
                label: "New Project...",
                enabled: true,
                click: () => {
                    ipcMain.emit(MenuEvents.CREATE_PROJECT)
                }
            },
            {
                label: "Open Project...",
                enabled: true,
                click: () => {
                    ipcMain.emit(MenuEvents.OPEN_PROJECT)
                }
            },
            { type: "separator" },
            {
                label: "Load Zko file",
                enabled: projectOpen,
                click: () => {
                    ipcMain.emit(MenuEvents.LOAD_ZKO)
                }
            },
            { type: "separator" },
            {
                label: "Import file...",
                enabled: projectOpen,
                submenu: [
                    {
                        label: "Import GlTF (.gltf, .glb)",
                        click: () => {
                            ipcMain.emit(MenuEvents.IMPORT_FILE, { format: "gltf" })
                        }
                    },
                    {
                        label: "Import OBJ (.obj)",
                        click: () => {
                            ipcMain.emit(MenuEvents.IMPORT_FILE, { format: "obj" })
                        }
                    },
                    {
                        label: "Import FBX (.fbx)",
                        click: () => {
                            ipcMain.emit(MenuEvents.IMPORT_FILE, { format: "fbx" })
                        }
                    },
                    {
                        label: "Import Collada (.dae)",
                        click: () => {
                            ipcMain.emit(MenuEvents.IMPORT_FILE, { format: "collada" })
                        }
                    }
                ],
            },
            { type: 'separator' },
            Constants.isMac ? { role: 'close' as const } : { role: 'quit' as const },
        ]
    }
}
