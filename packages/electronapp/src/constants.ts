import _ from "lodash";
import {nativeImage} from "electron";
import path from "path";

const DEV_FRONTEND_URL = "http://localhost:5173"
const MAIN_WINDOW_ENTRY = path.join(__dirname, '..', `renderer/index.html`)
const PRELOAD_SCRIPT_PATH = path.resolve(__dirname, '..', 'preload/preload.js')

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
        return path.join(__dirname, '../../assets/icons/zklogo.png')
    }

    public static get isDebug(): boolean {
        return !_.isNil(process.env.DEBUG) && process.env.DEBUG === 'true'
    }

    public static get ShouldStartServer(): boolean {
        return !Constants.isDebug
    }

    public static get PreloadScriptPath(): string {
        return PRELOAD_SCRIPT_PATH
    }

    public static get MainWindowPath(): string {
        if (Constants.isDebug) {
            return DEV_FRONTEND_URL
        } else {
            return MAIN_WINDOW_ENTRY
        }
    }

}