import {defineStore} from "pinia"
import {
    DEFAULT_PARSE_OPTIONS,
    findById,
    LoadOptions,
    ParseOptions,
    ProtoZkObject,
    ZObject,
    ZObjectType,
} from "@zernikalos/zkbuilder"
import {ref} from "vue"
import {useZkBuilderStore} from "./zkbuilder-store"
import _ from "lodash"

export const useStudioStore = defineStore("studioStore", () => {
    const root = ref<ZObject>()
    const obj = ref<ZObject>()
    const zkbuilderStore = useZkBuilderStore()

    function select(newSelected: ZObject | undefined) {
        obj.value = newSelected
    }

    function selectById(id: string) {
        if (_.isNil(root.value)) {
            return
        }
        const newSelect = findById(root.value, id)
        select(newSelect)
    }

    async function parseFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        root.value = await zkbuilderStore.parseFile(loadOptions, _.merge({}, parseOptions, {defaultCamera: true, defaultScene: true}))
    }

    async function exportRootAsProtoString(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return zkbuilderStore.exportAsProtoString(root.value)
    }

    function _cleanDataArrays(node: ProtoZkObject) {
        if (node.type === ZObjectType.MODEL) {
            const model = node.model!!
            Object.values(model.mesh.buffers).forEach((buff: any) => delete buff.dataArray)
            const texture = model?.material?.texture
            if (!_.isNil(texture)) {
                delete texture.dataArray
            }
        }
        delete node.children
        // node.children = node.children.map((c) => cleanDataArrays(c))
        return node
    }

    async function _objectToCleanJson(node: ZObject | undefined) {
        if (_.isNil(node)) {
            return
        }
        const result = await zkbuilderStore.exportAsObject(node)
        _cleanDataArrays(result)

        return JSON.stringify(result, null, 4)
    }

    async function exportRootAsJsonString(): Promise<string | undefined> {
        return await _objectToCleanJson(root.value)
    }

    async function exportSelectedAsJsonString(): Promise<string | undefined> {
        return await _objectToCleanJson(obj.value)
    }

    return {root, obj, parseFile, select, selectById,
        exportRootAsProtoString,
        exportRootAsJsonString,
        exportSelectedAsJsonString
    }
})
