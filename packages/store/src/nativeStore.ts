import {defineStore} from "pinia"
import {useNestStore} from "./nestStore"
import {useFileApiStore} from "./fileapiStore"
import _ from "lodash"

export const useNativeNest = defineStore("NativeNest", () => {

    const nestStore = useNestStore()
    const fileApiStore = useFileApiStore()

    // @ts-ignore
    window.NativeZernikalos.handleShowImport(async (ev, payload: {path: string, fileName: string, format:  "obj" | "gltf" | "fbx" | undefined}) => {
        const url = await fileApiStore.getUrlForFile({path: payload.path, fileName: payload.fileName})
        if (_.isNil(url)) {
            return
        }
        await nestStore.parseFile({filePath: url, format: payload.format})
    })

    // @ts-ignore
    window.NativeZernikalos.handleBundleScene(async (ev, payload: {path: string, fileName: string}) => {
        const fileData = await nestStore.exportRootAsProtoBuffer()
        if (_.isNil(fileData)) {
            return
        }
        // @ts-ignore
        window.NativeZernikalos.actionSaveFile(fileData)
    })

    // async function requestDownload(): Promise<{path: string, fileName: string}> {
    //     return new Promise((resolve) => {
    //         // @ts-ignore
    //         window.NativeZernikalos.handleBundleScene(async (ev, payload: {path: string, fileName: string}) => {
    //             resolve(payload)
    //         })
    //
    //         // @ts-ignore
    //         window.NativeZernikalos.actionDownload()
    //     })
    // }

    return {}
})