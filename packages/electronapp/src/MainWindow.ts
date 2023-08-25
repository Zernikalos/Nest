import {BrowserWindow} from "electron";
import path from "path";
import {MenuEvents, RendererMenuEvents} from "./menu/MenuEvents";

declare const STUDIO_VITE_DEV_SERVER_URL: string
declare const STUDIO_VITE_NAME: string

export class MainWindow {

    private mainWindow: BrowserWindow

    constructor(width: number, height: number) {

        this.mainWindow = new BrowserWindow({
            icon: '../assets/zklogo.icns',
            width: Math.floor(width * 0.8),
            height: Math.floor(height * 0.8),
            title: "Zernikalos Studio",
            webPreferences: {
                preload: path.join(__dirname, './preload.js'),
            },
        })

        this.subscribeToEvents()

    }

    public async load() {
        if (STUDIO_VITE_DEV_SERVER_URL) {
            await this.mainWindow.loadURL(STUDIO_VITE_DEV_SERVER_URL)
        } else {
            await this.mainWindow.loadFile(path.join(__dirname, `../renderer/${STUDIO_VITE_NAME}/index.html`));
        }
    }

    private subscribeToEvents() {
        this.mainWindow!.on(MenuEvents.IMPORT_FILE, () => {
            this.mainWindow!.webContents.send(RendererMenuEvents.IMPORT_FILE)
        })

        this.mainWindow!.on(MenuEvents.BUNDLE_SCENE, () => {
            this.mainWindow!.webContents.send(RendererMenuEvents.BUNDLE_SCENE)
        })
    }

}