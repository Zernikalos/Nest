import {BrowserWindow} from "electron";
import path from "path";
import {MenuEvents, RendererMenuEvents} from "./menu/MenuEvents";

declare const NESTUI_VITE_DEV_SERVER_URL: string
declare const NESTUI_VITE_NAME: string

export class ViewerWindow {

    private viewerWindow: BrowserWindow
    constructor(width: number, height: number) {

        this.viewerWindow = new BrowserWindow({
            icon: '../assets/zklogo.icns',
            width: Math.floor(width * 0.5),
            height: Math.floor(height * 0.5),
            title: "Zernikalos Nest",
            webPreferences: {
                preload: path.join(__dirname, './preload.js'),
            },
        })

        this.subscribeToEvents()

    }

    public async load() {
        if (NESTUI_VITE_DEV_SERVER_URL) {
            await this.viewerWindow.loadURL(NESTUI_VITE_DEV_SERVER_URL)
        } else {
            await this.viewerWindow.loadFile(path.join(__dirname, `../renderer/${NESTUI_VITE_NAME}/index.html`));
        }
    }

    private subscribeToEvents() {

    }

}