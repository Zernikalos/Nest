import {
    app,
    screen,
    BrowserWindow,
    Menu
} from 'electron'
import {studioServerBootstrap} from "@zernikalos/studioserver"

import {createMenu} from "./menu";
import {MainWindow} from "./MainWindow";

class ZernikalosStudio {

    private mainWindow: MainWindow
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
        this.mainWindow = new MainWindow(width, height)

        await this.mainWindow.load()
    }

    private async initializeServer() {
        await studioServerBootstrap()
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

const zernikalosStudio = new ZernikalosStudio()
zernikalosStudio.initialize()



