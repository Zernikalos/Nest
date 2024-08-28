import SaveDialogReturnValue = Electron.SaveDialogReturnValue;
import OpenDialogReturnValue = Electron.OpenDialogReturnValue;
import path from "path";

export interface PathInfo {
    filePath: string
    parsedPath: path.ParsedPath
}

export function cleanDialogReturnValue(dialogReturnValue: SaveDialogReturnValue | OpenDialogReturnValue): PathInfo | undefined {
    if (dialogReturnValue.canceled) {
        return
    }

    let filePath: string
    if ('filePath' in dialogReturnValue) {
        filePath = (dialogReturnValue as SaveDialogReturnValue).filePath
    } else {
        filePath = (dialogReturnValue as OpenDialogReturnValue).filePaths[0]
    }
    return {parsedPath: path.parse(filePath), filePath: filePath}
}