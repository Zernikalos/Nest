import {BrowserWindow, dialog} from "electron";
import {cleanDialogReturnValue, PathInfo} from "./cleanDialogReturnValue";
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

    const dialogReturnValue = await dialog.showOpenDialog(browserWindow,)
    const cleanedValue=  cleanDialogReturnValue(dialogReturnValue)
    if (cleanedValue) {
        lastPath = cleanedValue.filePath
    }
    return cleanedValue
}