import {defineStore} from "pinia"
import {DEFAULT_PARSE_OPTIONS, findById, LoadOptions, ParseOptions, ZObject} from "@zernikalos/zkbuilder"
import {ref} from "vue"
import {useZkBuilderStore} from "stores/zkbuilder-store"

export const useStudioStore = defineStore("studioStore", () => {
    const root = ref<ZObject>()
    const obj = ref<ZObject>()
    const zkbuilderStore = useZkBuilderStore()

    function select(newSelected: ZObject) {
        obj.value = newSelected
    }

    function selectById(id: string) {
        const newSelect = findById(root.value, id)
        select(newSelect)
    }

    async function parseFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        root.value = await zkbuilderStore.parseFile(loadOptions, parseOptions)
    }

    async function exportRootAsProtoString(): Promise<string> {
        return zkbuilderStore.exportAsProtoString(root.value)
    }

    async function exportRootAsJsonString(): Promise<string> {
        return zkbuilderStore.exportRootAsJsonString(root.value)
    }

    return {root, obj, parseFile, select, selectById, exportRootAsProtoString, exportRootAsJsonString}
})
