import {BrowserWindow, dialog} from "electron";
export function bundleSceneDialog(browserWindow: BrowserWindow) {
    return dialog.showSaveDialog(browserWindow,{
        title: "Bundle scene",
        defaultPath: "Untitled.zko",
        message: "Bundle scene",
        buttonLabel: "Bundle",
        filters: [
            { name: "All Files", extensions: ["*"] }
        ],
        properties: ["createDirectory", "showOverwriteConfirmation"]
    })
}