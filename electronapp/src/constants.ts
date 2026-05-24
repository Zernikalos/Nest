import _ from "lodash";
import {app, nativeImage} from "electron";
import path from "path";
import * as fs from "fs";

const DEFAULT_DEV_VUEUI_URL = "http://localhost:5174";
const VITE_DEV_PORT_FILE = ".vite-dev-port";
const VUEUI_MAIN_ENTRY = path.join(app.getAppPath(), 'vueui', 'dist', 'index.html');
const PRELOAD_SCRIPT_PATH = path.resolve(__dirname, '..', 'preload/preload.js');

let _devVueUrl: string | null = null;

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

    public static get userDataPath(): string {
        return app.getPath('userData')
    }

    public static get userSettingsPath(): string {
        return path.join(Constants.userDataPath, 'nest', 'settings.json')
    }

    public static get ideSessionPath(): string {
        return path.join(Constants.userDataPath, 'nest', 'ide-session.json')
    }

    public static get nestDbPath(): string {
        return path.join(Constants.userDataPath, 'nest.sqlite')
    }

    public static get PreloadScriptPath(): string {
        return PRELOAD_SCRIPT_PATH
    }

    public static get MainWindowPath(): string {
        if (Constants.isDebug) {
            if (_devVueUrl) return _devVueUrl;
            try {
                const portPath = path.join(process.cwd(), VITE_DEV_PORT_FILE);
                if (fs.existsSync(portPath)) {
                    const port = fs.readFileSync(portPath, 'utf8').trim();
                    _devVueUrl = `http://localhost:${port}`;
                    return _devVueUrl;
                }
            } catch {
                // fallback
            }
            return DEFAULT_DEV_VUEUI_URL;
        }
        return VUEUI_MAIN_ENTRY;
    }

}
