import {BrowserWindow, ipcMain} from "electron"
import path from "path"
import {MenuEvents, RendererMenuEvents} from "./menu/MenuEvents"
import {importFileDialog} from "./dialogs/importFileDialog"
import {bundleSceneDialog} from "./dialogs/bundleSceneDialog"
import {NestEvents} from "./NestEvents"
import * as fs from "node:fs/promises"
import {Constants} from "./constants"
import {getStore} from "./electronStore"
import {loadZkoDialog} from "./dialogs/loadZkoDialog"
import _ from "lodash";

export class MainWindow {
    private mainWindow: BrowserWindow

    constructor(width: number, height: number) {
        this.mainWindow = new BrowserWindow({
            icon: Constants.trayIcon,
            width: width,
            height: height,
            title: "Zernikalos Nest",
            webPreferences: {
                preload: Constants.PreloadScriptPath,
            },
        })

        this.subscribeToEvents()
    }

    public async load() {
        await this.mainWindow.loadFile(path.join(__dirname, '..', `renderer/index.html`));

        // if (Constants.MainScriptPath) {
        //     await this.mainWindow.loadURL(Constants.MainScriptPath)
        // } else {
        //     await this.mainWindow.loadFile(path.join(__dirname, `renderer/index.html`));
        // }
    }

    private sendToRenderer(ev: RendererMenuEvents, payload?: any) {
        if (!this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send(ev, payload)
        }
    }

    private subscribeToEvents() {
        this.mainWindow.on("resize", () => {
            const [width, heigt] = this.mainWindow.getSize()
            getStore().set('windowSize', {width, heigt})
        })

        ipcMain.on(MenuEvents.LOAD_ZKO, async () => {
            const pathInfo = await loadZkoDialog(this.mainWindow)

            if (_.isNil(pathInfo)) {
                return
            }
            this.sendToRenderer(RendererMenuEvents.LOAD_ZKO, {
                path: pathInfo.parsedPath.dir,
                fileName: pathInfo.parsedPath.base
            })
        })

        ipcMain.on(MenuEvents.IMPORT_FILE, async (event, data: { format: "gltf" | "obj" | "fbx" }) => {
            const pathInfo = await importFileDialog(this.mainWindow, data.format)
            if (_.isNil(pathInfo)) {
                return
            }
            this.sendToRenderer(RendererMenuEvents.IMPORT_FILE, {
                path: pathInfo.parsedPath.dir,
                fileName: pathInfo.parsedPath.base,
                format: data.format
            })
        })

        ipcMain.on(MenuEvents.BUNDLE_SCENE, async () => {
            const pathInfo = await bundleSceneDialog(this.mainWindow)
            if (_.isNil(pathInfo)) {
                return;
            }

            this.sendToRenderer(RendererMenuEvents.BUNDLE_SCENE, {
                path: pathInfo.parsedPath.dir,
                fileName: pathInfo.parsedPath.base,
            })

            ipcMain.once(NestEvents.SAVE_FILE, async (ev, fileData: Uint8Array) => {
                try {
                    await fs.writeFile(pathInfo.filePath, fileData)
                } catch (e) {
                    console.log(`Unable to write file to ${path}. Error: ${e}`)
                }
            })
        })

        ipcMain.handle("userSettings:get", (event, key) => {
            return getStore().get(key)
        })

        ipcMain.handle("userSettings:set", (event, key, value) => {
            getStore().set(key, value)
        })
    }
}