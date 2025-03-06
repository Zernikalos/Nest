import _ from "lodash";
import {nativeImage} from "electron";
import path from "path";

declare const ZERNIKALOS_NEST_MAIN_WINDOW_WEBPACK_ENTRY: string
declare const ZERNIKALOS_NEST_MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const DEV_FRONTEND_URL = "http://localhost:5173"

export class Constants {
    public static get isMac(): boolean {
        return process.platform === 'darwin'
    }

    private static _trayIcon: Electron.NativeImage
    public static get trayIcon(): Electron.NativeImage {
        if (_.isNil(Constants._trayIcon)) {
            Constants._trayIcon = nativeImage.createFromPath(Constants.trayIconPath)
        }
        return Constants._trayIcon
    }

    public static get trayIconPath(): string {
        return path.join(__dirname, '../assets/icons/zklogo.png')
    }

    public static get ShouldStartServer(): boolean {
        return _.isNil(process.env.START_SERVER) || process.env.START_SERVER === 'true'
    }

    public static get PreloadScriptPath(): string {
        try {
            return ZERNIKALOS_NEST_MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        } catch {
            return path.join(__dirname, './preload.js')
        }
    }

    public static get MainScriptPath(): string {
        try {
            if (Constants.ShouldStartServer) {
                return ZERNIKALOS_NEST_MAIN_WINDOW_WEBPACK_ENTRY
            } else {
                return DEV_FRONTEND_URL
            }
        } catch {
            return DEV_FRONTEND_URL
        }
    }

}