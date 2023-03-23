import {createPinia, defineStore} from "pinia"
import {App, Ref, ref} from "vue";
import {
    DEFAULT_PARSE_OPTIONS,
    exportZkoAs,
    ExportOptions,
    loadZkoParseable,
    LoadOptions,
    ZkObject,
    ParseOptions,
    parseToZko
} from "@zernikalos/exporter"
// @ts-ignore
import _ from "lodash"

export function createStudioStore(app: App) {
    createPinia().install(app)
}

export const useZkoLoaderStore = defineStore('zko', () => {
    const root: Ref<ZkObject | undefined> = ref ()

    async function loadFromFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        const mergedLoadOptions = _.merge({}, loadOptions)
        const mergedParseOptions = _.merge({}, parseOptions)

        const parseableObj = await loadZkoParseable(mergedLoadOptions)
        root.value = parseToZko(parseableObj, mergedParseOptions)
    }

    async function exportAs(exportOptions: ExportOptions) {
        if (_.isNil(root.value)) {
            return ''
        }
        return await exportZkoAs(root.value as ZkObject, exportOptions)
    }

    function $reset() {
        root.value = undefined
    }

    return {root, loadFromFile, exportAs, $reset}
})
