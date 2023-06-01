import {app, BrowserWindow, nativeTheme} from "electron"
import {initialize, enable} from "@electron/remote/main"
import path from "path"
import os from "os"
import {stopServer, studioServerBootstrap} from "app/src-nest/main"

// import express from "express"
// const appE = express()
//
// appE.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//
// appE.listen(3000, () => {
//   console.log("listening")
// })

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
    if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
        require("fs").unlinkSync(
            path.join(app.getPath("userData"), "DevTools Extensions")
        )
    }
} catch (_) {}

let mainWindow: BrowserWindow | undefined

async function createWindow() {
    initialize()
    await studioServerBootstrap()

    /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
        width: 1750,
        height: 1000,
        useContentSize: true,
        frame: false,
        webPreferences: {
            sandbox: false,
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
        }
    })

    enable(mainWindow.webContents)

    mainWindow.loadURL(process.env.APP_URL)

    if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools()
    } else {
    // we're on production; no access to devtools pls
        mainWindow.webContents.on("devtools-opened", () => {
            mainWindow?.webContents.closeDevTools()
        })
    }

    mainWindow.on("closed", () => {
        mainWindow = undefined
    })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", async() => {
    if (platform !== "darwin") {
        await stopServer()
        app.quit()
    }
})

app.on("activate", async() => {
    if (mainWindow === undefined) {
        await createWindow()
    }
})
