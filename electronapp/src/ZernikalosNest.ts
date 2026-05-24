import {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
} from 'electron'
import { nestServerBootstrap, ZNestServer } from "./nestServerAdapter"

import { createMenu } from "./menu"
import { MainWindow, registerMainWindowIpcHandlers } from "./MainWindow"
import { registerIdeStorageIpcHandlers } from "./storage/ideSessionStorage"
import {desiredWindowSize, WindowSize} from "./tools/desiredWindowSize"
import {Constants} from "./constants"

export class ZernikalosNest {

    private mainWindow!: MainWindow
    public menu?: Menu
    private nestServer!: ZNestServer

    public async initialize() {

        app.commandLine.appendSwitch('enable-unsafe-webgpu');

        app.dock?.setIcon(Constants.trayIconPath)

        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        await app.whenReady()

        this.initializeMenu()

        await this.initializeServer()
        registerMainWindowIpcHandlers(
            () => this.mainWindow,
            () => this.nestServer.settings,
        )
        registerIdeStorageIpcHandlers()

        const size = this.desiredSize
        await this.initializeWindow(size.width, size.height)

        this.handleAppEvents()
    }

    public get desiredSize(): WindowSize {
        return desiredWindowSize()
    }

    private initializeMenu() {
        this.menu = createMenu()
    }

    private async initializeWindow(width: number, height: number) {
        this.mainWindow = new MainWindow(this.nestServer.settings)
        // this.viewerWindow = new ViewerWindow(width, height)

        await this.mainWindow.load()
        // await this.viewerWindow.load()
    }

    private async initializeServer() {
        const dbPath = Constants.nestDbPath
        const settingsPath = Constants.userSettingsPath
        this.nestServer = await nestServerBootstrap({
            dbPath,
            settingsPath
        })
        console.log(`[ZernikalosNest] Nest server started on port: ${this.nestServer.port}`)
        this.registerApiUrlHandler()
    }

    /** So the renderer can get the Nest API base URL (dynamic port in dev and prod). */
    private registerApiUrlHandler() {
        ipcMain.handle('get-api-url', (): string => {
            const apiUrl = `http://localhost:${this.nestServer.port}/`
            console.log(`[ZernikalosNest] Providing API URL to renderer: ${apiUrl}`)
            return apiUrl
        })
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