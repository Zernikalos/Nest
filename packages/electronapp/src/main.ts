import path from "path"
import {
    app,
    screen,
    BrowserWindow,
    nativeImage,
    Menu
} from 'electron'
import {studioServerBootstrap} from "@zernikalos/studioserver"

import {createMenu} from "./menu";

declare const STUDIO_VITE_DEV_SERVER_URL: string
declare const STUDIO_VITE_NAME: string

// const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;
const isDev = process.env.NODE_ENV === "dev"

class ZernikalosStudio {

    public mainWindow?: BrowserWindow
    public menu?: Menu

    public async initialize() {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        await app.whenReady()

        this.initializeMenu()

        await this.initializeServer()

        const size = this.desiredSize
        await this.initializeWindow(size.width, size.height)

        this.handleAppEvents()
    }

    public get desiredSize(): {width: number, height: number} {
        // Create a window that fills the screen's available work area.
        const primaryDisplay = screen.getPrimaryDisplay()
        const { width, height } = primaryDisplay.workAreaSize
        return {width, height}
    }

    private initializeMenu() {
        this.menu = createMenu()
    }

    private async initializeWindow(width: number, height: number) {
        const icon = nativeImage.createFromPath('../assets/zklogo.icns')
        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            icon: '../assets/zklogo.icns',
            width: Math.floor(width * 0.8),
            height: Math.floor(height * 0.8),
            title: "Zernikalos Studio",
            webPreferences: {
                preload: path.join(__dirname, './preload.js'),
            },
        })

        this.mainWindow.setIcon(icon)

        // and load the index.html of the app.
        // mainWindow.loadURL(
        //     isDev ?
        //         'http://localhost:3000' :
        //         join(__dirname, '../../index.html')
        // );
        // mainWindow.loadURL('http://localhost:5173')

        if (STUDIO_VITE_DEV_SERVER_URL) {
            await this.mainWindow.loadURL(STUDIO_VITE_DEV_SERVER_URL)
        } else {
            await this.mainWindow.loadFile(path.join(__dirname, `../renderer/${STUDIO_VITE_NAME}/index.html`));
        }
        // Open the DevTools.
        if (isDev) {
            // mainWindow.webContents.openDevTools();
        }
    }

    private async initializeServer() {
        await studioServerBootstrap()
    }

    private handleAppEvents() {
        app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow(width, height)
        })
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })

        this.mainWindow!.on("import-file", () => {
            this.mainWindow!.webContents.send("show-import-file")
        })
    }
}

const zernikalosStudio = new ZernikalosStudio()
zernikalosStudio.initialize()



