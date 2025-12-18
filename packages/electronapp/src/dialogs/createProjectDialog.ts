import { BrowserWindow, dialog } from "electron";
import { cleanDialogReturnValue, PathInfo } from "./cleanDialogReturnValue";
import SaveDialogOptions = Electron.SaveDialogOptions;
import _ from "lodash";
import path from "path";

let lastPath: string | undefined = undefined;

export async function createProjectDialog(
    browserWindow: BrowserWindow,
    projectName: string
): Promise<PathInfo | undefined> {
    const config: SaveDialogOptions = {
        title: "Create New Project",
        defaultPath: projectName ? `${projectName}.zkproj` : "Untitled.zkproj",
        message: "Choose where to save your project",
        buttonLabel: "Create",
        filters: [
            { name: "Zernikalos Project", extensions: ["zkproj"] },
            { name: "All Files", extensions: ["*"] }
        ],
        properties: ["createDirectory", "showOverwriteConfirmation"]
    };

    if (!_.isNil(lastPath)) {
        const dir = path.dirname(lastPath);
        config.defaultPath = path.join(dir, projectName ? `${projectName}.zkproj` : "Untitled.zkproj");
    }

    const dialogReturnValue = await dialog.showSaveDialog(browserWindow, config);
    const cleanedValue = cleanDialogReturnValue(dialogReturnValue);
    if (cleanedValue) {
        lastPath = cleanedValue.filePath;
    }
    return cleanedValue;
}

