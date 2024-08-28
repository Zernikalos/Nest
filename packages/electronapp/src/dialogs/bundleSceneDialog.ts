import {BrowserWindow, dialog} from "electron";
import {cleanDialogReturnValue, PathInfo} from "./cleanDialogReturnValue";
import SaveDialogOptions = Electron.SaveDialogOptions;
import _ from "lodash";

let lastPath: string | undefined = undefined

export async function bundleSceneDialog(browserWindow: BrowserWindow): Promise<PathInfo | undefined> {
    const config: SaveDialogOptions = {
        title: "Bundle scene",
        defaultPath: "Untitled.zko",
        message: "Bundle scene",
        buttonLabel: "Bundle",
        filters: [
            { name: "All Files", extensions: ["*"] }
        ],
        properties: ["createDirectory", "showOverwriteConfirmation"]
    }
    if (!_.isNil(lastPath)){
        config.defaultPath = lastPath
    }

    const dialogReturnValue = await dialog.showSaveDialog(browserWindow,config)
    const cleanedValue = cleanDialogReturnValue(dialogReturnValue)
    if (cleanedValue) {
        lastPath = cleanedValue.filePath
    }
    return cleanedValue
}