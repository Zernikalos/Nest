import {BrowserWindow, dialog} from "electron"
import {cleanDialogReturnValue, PathInfo} from "./cleanDialogReturnValue";
import OpenDialogOptions = Electron.OpenDialogOptions;
import _ from "lodash";
function buildFiltersFromFormat(format: "gltf" | "obj" | "fbx" | "collada") {
    switch (format) {
        case "gltf":
            return { name: 'GLTF', extensions: ['gltf', 'glb'] }
        case "obj":
            return { name: 'OBJ', extensions: ['obj'] }
        case "fbx":
            return { name: 'FBX', extensions: ['fbx'] }
        case "collada":
            return { name: 'Collada', extensions: ['dae'] }
    }
}

let lastPath: string | undefined = undefined

export async function importFileDialog(browserWindow: BrowserWindow, format: "gltf" | "obj" | "fbx"): Promise<PathInfo | undefined> {
    const filter = buildFiltersFromFormat(format)
    const config: OpenDialogOptions = {
        title: "Import file",
        buttonLabel: "Import",
        filters: [
            filter,
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    }
    if (!_.isNil(lastPath)){
        config.defaultPath = lastPath
    }

    const dialogReturnValue = await dialog.showOpenDialog(browserWindow,config)
    const cleanedValue = cleanDialogReturnValue(dialogReturnValue)
    if (cleanedValue) {
        lastPath = cleanedValue.filePath
    }
    return cleanedValue
}