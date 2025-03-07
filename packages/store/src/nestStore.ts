import {defineStore} from "pinia"
import {
    DEFAULT_PARSE_OPTIONS,
    LoadOptions,
    ParseOptions,
    ZkoParsed,
    ZObject,
    ZObjectType,
    ZkoFormat,
    ZkoObjectProto,
    ZkObjectTypes
} from "@zernikalos/zkbuilder"
import {ref} from "vue"
import {useZkBuilderStore} from "./zkbuilderStore"
import _ from "lodash"

export const useNestStore = defineStore("nestStore", () => {
    const root = ref<ZObject>()
    const zkoParsed = ref<ZkoParsed>()
    const zkoFileObject = ref<ZkoFormat>()
    const zkbuilderStore = useZkBuilderStore()

    async function parseFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        zkoParsed.value = await zkbuilderStore.parseFile(loadOptions, _.merge({}, parseOptions, {}))
        zkoFileObject.value = await zkbuilderStore.exportAsObject(zkoParsed.value)
        root.value = zkoParsed.value.root
    }

    async function exportRootAsProtoString(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return zkbuilderStore.exportAsProtoString(zkoParsed.value!)
    }

    async function exportRootAsProtoBuffer(): Promise<Uint8Array | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return await zkbuilderStore.exportAsProtoBuffer(zkoParsed.value!)
    }

    async function exportRootAsJsonStringFull(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return await zkbuilderStore.exportAsJsonString(zkoParsed.value!)
    }

    function _cleanDataArrays(node: ZkoObjectProto) {
        if (node.type === ZObjectType.MODEL.name) {
            const model = node.model!!
            Object.values(model.mesh.rawBuffers).forEach((buff: any) => delete buff.dataArray)
            const texture = model?.material?.data?.texture
            if (!_.isNil(texture)) {
                delete texture.data.dataArray
            }
        }
        return node
    }

    function _cleanProtoZkObjectForEdit(node: ZkoObjectProto): ZkObjectTypes | undefined {
        switch (node.type) {
            case ZObjectType.MODEL.name:
                return node.model ?? undefined
            case ZObjectType.CAMERA.name:
                return node.camera ?? undefined
            case ZObjectType.GROUP.name:
                return node.group ?? undefined
            case ZObjectType.SCENE.name:
                return node.scene ?? undefined
            case ZObjectType.SKELETON.name:
                return node.skeleton ?? undefined
            // case ZObjectType.JOINT.name:
            //     return node.joint
        }
    }

    async function _objectToCleanJson(node: ZObject | undefined) {
        if (_.isNil(node)) {
            return
        }
        let exported = await zkbuilderStore.exportAsObject({root: node})
        if (_.isNil(exported)) {
            return
        }
        let result = exported?.objects.find(o => o.refId === node.refId)
        result = _cleanDataArrays(result)
        const cleaned= _cleanProtoZkObjectForEdit(result)

        return JSON.stringify(cleaned, null, 4)
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
