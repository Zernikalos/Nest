import {createPinia, defineStore} from "pinia"
import {App, Ref, ref} from "vue";
import {
    DEFAULT_PARSE_OPTIONS,
    zkExport,
    ExportOptions,
    zkLoad,
    LoadOptions,
    ZObject,
    ParseOptions,
    zkParse
} from "@zernikalos/exporter"
// @ts-ignore
import _ from "lodash"

export function createStudioStore(app: App) {
    createPinia().install(app)
}

export const useZkoLoaderStore = defineStore('zko', () => {
    const root: Ref<ZObject | undefined> = ref ()

    async function loadFromFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        const mergedLoadOptions = _.merge({}, loadOptions)
        const mergedParseOptions = _.merge({}, parseOptions)

        const parseableObj = await zkLoad(mergedLoadOptions)
        root.value = zkParse(parseableObj, mergedParseOptions)
    }

    async function exportAs(exportOptions: ExportOptions) {
        if (_.isNil(root.value)) {
            return ''
        }
        return await zkExport(root.value as ZObject, exportOptions)
    }

    function $reset() {
        root.value = undefined
    }

    return {root, loadFromFile, exportAs, $reset}
})
