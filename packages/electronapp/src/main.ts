import {
    app,
    BrowserWindow,
    Menu
} from 'electron'
import {nestServerBootstrap} from "@zernikalos/nestserver"

import {createMenu} from "./menu";
import {MainWindow} from "./MainWindow";
// import {ViewerWindow} from "./ViewerWindow";
import {WindowSize, windowSize169} from "./tools/desiredWindowSize";

class ZernikalosNest {

    private mainWindow!: MainWindow
    // private viewerWindow: ViewerWindow
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

    public get desiredSize(): WindowSize {
        return windowSize169()
    }

    private initializeMenu() {
        this.menu = createMenu()
    }

    private async initializeWindow(width: number, height: number) {
        this.mainWindow = new MainWindow(width, height)
        // this.viewerWindow = new ViewerWindow(width, height)

        await this.mainWindow.load()
        // await this.viewerWindow.load()
    }

    private async initializeServer() {
        const nestApp = await nestServerBootstrap()
        console.log(nestApp.app.sayHello())
    }

    private handleAppEvents() {
        app.on('activate',  async () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                await this.initializeWindow(this.desiredSize.width, this.desiredSize.height)
            }
        })
        // Quit when all windows are closed, except on macOS. There, it's common
        // for applications and their menu bar to stay active until the user quits
        // explicitly with Cmd + Q.
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })

    }
}

const zernikalosNest = new ZernikalosNest()
zernikalosNest.initialize()



