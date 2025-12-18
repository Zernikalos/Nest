import { BrowserWindow, dialog } from "electron";
import { cleanDialogReturnValue, PathInfo } from "./cleanDialogReturnValue";
import OpenDialogOptions = Electron.OpenDialogOptions;
import _ from "lodash";

let lastPath: string | undefined = undefined;

export async function openProjectDialog(browserWindow: BrowserWindow): Promise<PathInfo | undefined> {
    const config: OpenDialogOptions = {
        title: "Open Project",
        buttonLabel: "Open",
        filters: [
            { name: 'Zernikalos Project', extensions: ['zkproj'] },
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    };
    
    if (!_.isNil(lastPath)) {
        config.defaultPath = lastPath;
    }

    const dialogReturnValue = await dialog.showOpenDialog(browserWindow, config);
    const cleanedValue = cleanDialogReturnValue(dialogReturnValue);
    if (cleanedValue) {
        lastPath = cleanedValue.filePath;
    }
    return cleanedValue;
}

