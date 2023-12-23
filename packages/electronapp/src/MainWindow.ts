import {BrowserWindow} from "electron"
import path from "path"
import {MenuEvents, RendererMenuEvents} from "./menu/MenuEvents"
import {importFileDialog} from "./dialogs/importFileDialog"
import {bundleSceneDialog} from "./dialogs/bundleSceneDialog";
import {NestEvents} from "./NestEvents";

declare const NESTUI_VITE_DEV_SERVER_URL: string
declare const NESTUI_VITE_NAME: string

export class MainWindow {

    private mainWindow: BrowserWindow
    constructor(width: number, height: number) {

        this.mainWindow = new BrowserWindow({
            icon: '../assets/zklogo.icns',
            width: width,
            height: height,
            title: "Zernikalos Nest",
            webPreferences: {
                preload: path.join(__dirname, './preload.js'),
            },
        })

        this.subscribeToEvents()
    }

    public async load() {
        if (NESTUI_VITE_DEV_SERVER_URL) {
            await this.mainWindow.loadURL(NESTUI_VITE_DEV_SERVER_URL)
        } else {
            await this.mainWindow.loadFile(path.join(__dirname, `../dist/renderer/index.html`));
        }
    }

    private sendToRenderer(ev: RendererMenuEvents, payload: any = undefined) {
        this.mainWindow!.webContents.send(ev, payload)
    }

    private subscribeToEvents() {
        this.mainWindow.on(MenuEvents.IMPORT_FILE, async (ev: { format: string }) => {
            const dialogReturnValue = await importFileDialog(this.mainWindow, ev.format)
            if (dialogReturnValue.canceled) {
                return
            }
            const parsedPath = path.parse(dialogReturnValue.filePaths[0])
            this.sendToRenderer(RendererMenuEvents.IMPORT_FILE, {
                path: parsedPath.dir,
                fileName: parsedPath.base,
                format: ev.format
            })
        })

        this.mainWindow!.on(MenuEvents.BUNDLE_SCENE, async () => {
            const dialogReturnValue = await bundleSceneDialog(this.mainWindow)
            if (dialogReturnValue.canceled) {
                return
            }
            const parsedPath = path.parse(dialogReturnValue.filePath!)
            this.sendToRenderer(RendererMenuEvents.BUNDLE_SCENE, {
                path: parsedPath.dir,
                fileName: parsedPath.base,
            })
        })

        this.mainWindow!.on(NestEvents.DOWNLOAD, async () => {
            const dialogReturnValue = await bundleSceneDialog(this.mainWindow)
            if (dialogReturnValue.canceled) {
                return
            }
            const parsedPath = path.parse(dialogReturnValue.filePath!)
            this.sendToRenderer(RendererMenuEvents.BUNDLE_SCENE, {
                path: parsedPath.dir,
                fileName: parsedPath.base,
            })
        })

    }

}