import {defineStore} from "pinia"
import {useNestStore} from "./nestStore"
import {useFileApiStore} from "./fileapiStore"
import _ from "lodash"

export const useNativeNest = defineStore("NativeNest", () => {

    if (_.isNil(window.NativeZernikalos)) {
        console.warn("NativeZernikalos is not exposed")
        return
    }

    const nestStore = useNestStore()
    const fileApiStore = useFileApiStore()

    window.NativeZernikalos.handleLoadZko( async (_ev: string, payload: {path: string,  fileName: string}) => {
        const fileData = await fileApiStore.getFile({path: payload.path, fileName: payload.fileName})
        if (_.isNil(fileData)) {
            return
        }
        nestStore.importZkoFile(fileData)
    })

    window.NativeZernikalos.handleShowImport(async (_ev: string, payload: {path: string, fileName: string, format:  "obj" | "gltf" | "fbx" | "collada" | undefined}) => {
        const url = await fileApiStore.getUrlForFile({path: payload.path, fileName: payload.fileName})
        if (_.isNil(url)) {
            return
        }
        await nestStore.parseFile({filePath: url, format: payload.format})
    })

    window.NativeZernikalos.handleBundleScene(async (_ev: string, _payload: {path: string, fileName: string}) => {
        const fileData = await nestStore.exportRootAsProtoBuffer()
        if (_.isNil(fileData)) {
            return
        }
        window.NativeZernikalos.actionSaveFile(fileData)
    })

    return {}
})