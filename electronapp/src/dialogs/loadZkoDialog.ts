import {BrowserWindow, dialog} from "electron";
import {cleanDialogReturnValue, PathInfo} from "./cleanDialogReturnValue";
import { prepareWindowForDialog } from "./prepareWindowForDialog";
import OpenDialogOptions = Electron.OpenDialogOptions;
import _ from "lodash";

let lastPath: string | undefined = undefined

export async function loadZkoDialog(browserWindow: BrowserWindow): Promise<PathInfo | undefined> {
    const config: OpenDialogOptions = {
        title: "Load Zko file",
        buttonLabel: "Load",
        filters: [
            { name: 'Zko', extensions: ['zko'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    }
    if (!_.isNil(lastPath)){
        config.defaultPath = lastPath
    }

    await prepareWindowForDialog(browserWindow);
    const dialogReturnValue = await dialog.showOpenDialog(browserWindow, config)
    const cleanedValue=  cleanDialogReturnValue(dialogReturnValue)
    if (cleanedValue) {
        lastPath = cleanedValue.filePath
    }
    return cleanedValue
}