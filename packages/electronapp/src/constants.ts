import _ from "lodash";
import {nativeImage} from "electron";
import path from "path";

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
}