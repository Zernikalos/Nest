import {defineStore} from "pinia"
import {
    DEFAULT_PARSE_OPTIONS,
    LoadOptions,
    ParseOptions,
    ProtoZkObject,
    ZObject,
    ZObjectType,
} from "@zernikalos/zkbuilder"
import {ref} from "vue"
import {useZkBuilderStore} from "./zkbuilderStore"
import _ from "lodash"

export const useNestStore = defineStore("nestStore", () => {
    const root = ref<ZObject>()
    const zkbuilderStore = useZkBuilderStore()

    async function parseFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        root.value = await zkbuilderStore.parseFile(loadOptions, _.merge({}, parseOptions, {}))
    }

    async function exportRootAsProtoString(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return zkbuilderStore.exportAsProtoString(root.value)
    }

    async function exportRootAsProtoBuffer(): Promise<Uint8Array | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return await zkbuilderStore.exportAsProtoBuffer(root.value)
    }

    function _cleanDataArrays(node: ProtoZkObject) {
        if (node.type === ZObjectType.MODEL.name) {
            const model = node.model!!
            Object.values(model.mesh.rawBuffers).forEach((buff: any) => delete buff.dataArray)
            const texture = model?.material?.data?.texture
            if (!_.isNil(texture)) {
                delete texture.data.dataArray
            }
        }
        // delete node.children
        return node
    }

    function _cleanProtoZkObjectForEdit(node: ProtoZkObject) {
        switch (node.type) {
            case ZObjectType.MODEL.name:
                return node.model
            case ZObjectType.CAMERA.name:
                return node.camera
            case ZObjectType.GROUP.name:
                return node.group
            case ZObjectType.SCENE.name:
                return node.scene
            // case ZObjectType.JOINT.name:
            //     return node.joint
            case ZObjectType.SKELETON.name:
                return node.skeleton
        }
    }

    async function _objectToCleanJson(node: ZObject | undefined) {
        if (_.isNil(node)) {
            return
        }
        let result: unknown = await zkbuilderStore.exportAsObject(node)
        result = _cleanDataArrays(result as ProtoZkObject)
        result = _cleanProtoZkObjectForEdit(result as ProtoZkObject)

        return JSON.stringify(result, null, 4)
    }

    async function exportRootAsJsonStringFull(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return await zkbuilderStore.exportAsJsonString(root.value)
    }

    async function exportRootAsJsonString(): Promise<string | undefined> {
        return await _objectToCleanJson(root.value)
    }

    async function exportObjectAsJsonString(obj: ZObject | undefined): Promise<string | undefined> {
        return await _objectToCleanJson(obj)
    }

    function importZkoFile(fileData: Uint8Array) {
        root.value = zkbuilderStore.importZko(new Int8Array(fileData))
    }

    return {root, parseFile,
        exportRootAsProtoString,
        exportRootAsProtoBuffer,
        exportRootAsJsonString,
        exportRootAsJsonStringFull,
        exportObjectAsJsonString,
        importZkoFile
    }
})
