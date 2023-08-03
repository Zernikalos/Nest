import {defineStore} from "pinia"
import {DEFAULT_PARSE_OPTIONS, findById, LoadOptions, ParseOptions, ZObject} from "@zernikalos/zkbuilder"
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
        root.value = await zkbuilderStore.parseFile(loadOptions, _.merge({}, parseOptions, {defaultCamera: false, defaultScene: false}))
    }

    async function exportRootAsProtoString(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return zkbuilderStore.exportAsProtoString(root.value)
    }

    async function exportRootAsJsonString(): Promise<string | undefined> {
        if (_.isNil(root.value)) {
            return
        }
        return zkbuilderStore.exportAsJsonString(root.value)
    }

    async function exportSelectedAsJsonString(): Promise<string | ""> {
        if (_.isNil(obj.value)) {
            return ""
        }
        return zkbuilderStore.exportAsJsonString(obj.value)
    }

    async function exportSelectedAsCleanedJson(): Promise<string | ""> {
        const exported = await zkbuilderStore.exportAsObject(obj.value)
        debugger
        delete exported.children

        return JSON.stringify(exported)
    }

    return {root, obj, parseFile, select, selectById,
        exportRootAsProtoString,
        exportRootAsJsonString,
        exportSelectedAsJsonString,
        exportSelectedAsCleanedJson
    }
})
