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
    const selected = ref<ZObject>()
    const zkbuilderStore = useZkBuilderStore()

    function select(newSelected: ZObject | undefined) {
        selected.value = newSelected
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
            Object.values(model.mesh.rawBuffers).forEach((buff: any) => delete buff.dataArray)
            const texture = model?.material?.texture
            if (!_.isNil(texture)) {
                delete texture.dataArray
            }
        }
        // delete node.children
        return node
    }

    function _cleanProtoZkObjectForEdit(node: ProtoZkObject) {
        switch (node.type) {
            case ZObjectType.MODEL:
                return node.model
            case ZObjectType.CAMERA:
                return node.camera
            case ZObjectType.GROUP:
                return node.group
            case ZObjectType.SCENE:
                return node.scene
        }
    }

    async function _objectToCleanJson(node: ZObject | undefined) {
        if (_.isNil(node)) {
            return
        }
        let result = await zkbuilderStore.exportAsObject(node)
        result = _cleanDataArrays(result)
        result = _cleanProtoZkObjectForEdit(result)

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

    async function exportSelectedAsJsonString(): Promise<string | undefined> {
        return await _objectToCleanJson(selected.value)
    }

    function updateSelected(jsonStr: string) {
        try {
            const newData = JSON.parse(jsonStr)
            _.merge(selected.value, newData)
        } catch (_e) {

        }

    }

    return {root, selected, parseFile, select, selectById,
        exportRootAsProtoString,
        exportRootAsJsonString,
        exportRootAsJsonStringFull,
        exportSelectedAsJsonString,
        updateSelected
    }
})
