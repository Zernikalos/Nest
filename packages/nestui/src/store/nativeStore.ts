import {defineStore} from "pinia"
import {useNestStore} from "./nestStore"
import {useFileApiStore} from "./fileapiStore"
import _ from "lodash"
import { ProjectData } from "./projectStore";

declare global {
    interface NativeZernikalos {
        createNewProject: () => Promise<{canceled: boolean, project: ProjectData}>;
        handleLoadZko: (callback: (ev: string, payload: { path: string; fileName: string; }) => Promise<void>) => void;
        handleShowImport: (callback: (ev: string, payload: { path: string; fileName: string; format: "obj" | "gltf" | "fbx" | "collada" | undefined; }) => Promise<void>) => void;
        handleBundleScene: (callback: (ev: string, _payload: { path: string; fileName: string; }) => Promise<void>) => void;
        actionSaveFile: (data: Uint8Array<ArrayBufferLike> | undefined) => void;
    }
    interface Window {
        NativeZernikalos: NativeZernikalos;
    }
}

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

    async function createNewProject(): Promise<{canceled: boolean, project: ProjectData} | undefined> {
        if (_.isNil(window.NativeZernikalos) || _.isNil(window.NativeZernikalos.createNewProject)) {
            console.warn("Native function 'createNewProject' is not available")
            return
        }
        return await window.NativeZernikalos.createNewProject()
    }

    return {
        createNewProject
    }
})