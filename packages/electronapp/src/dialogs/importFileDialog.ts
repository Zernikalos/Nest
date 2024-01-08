import {BrowserWindow, dialog} from "electron"
function buildFiltersFromFormat(format: "gltf" | "obj" | "fbx") {
    switch (format) {
        case "gltf":
            return { name: 'GLTF', extensions: ['gltf', 'glb'] }
        case "obj":
            return { name: 'OBJ', extensions: ['obj'] }
        case "fbx":
            return { name: 'FBX', extensions: ['fbx'] }
    }
}

export function importFileDialog(browserWindow: BrowserWindow, format: "gltf" | "obj" | "fbx") {
    const filter = buildFiltersFromFormat(format)

    return dialog.showOpenDialog(browserWindow,{
        title: "Import file",
        buttonLabel: "Import",
        filters: [
            filter,
            { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
    })
}