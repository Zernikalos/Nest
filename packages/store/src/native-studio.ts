import {defineStore} from "pinia"
import {useStudioStore} from "./studio-store";
import {useFileApiStore} from "./fileapi-store";
import _ from "lodash";

export const useNativeStudio = defineStore("NativeStudio", () => {

    const studioStore = useStudioStore()
    const fileApiStore = useFileApiStore()

    // @ts-ignore
    window.NativeZernikalos.handleShowImport(async (ev, payload: {path: string, fileName: string, format:  "obj" | "gltf" | "fbx" | undefined}) => {
        const url = await fileApiStore.getUrlForFile({path: payload.path, fileName: payload.fileName})
        if (_.isNil(url)) {
            return
        }
        await studioStore.parseFile({filePath: url, format: payload.format})
    })

    return {}
})