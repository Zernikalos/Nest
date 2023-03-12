import {createPinia, defineStore} from "pinia"
import {App, Ref, ref} from "vue";
import {
    DEFAULT_PARSE_OPTIONS,
    exportMrrAs,
    ExportOptions,
    loadMrrParseable,
    LoadOptions,
    MrObject,
    ParseOptions,
    parseToMrr
} from "@mrrobotto/exporter"
// @ts-ignore
import _ from "lodash"

export function createStudioStore(app: App) {
    createPinia().install(app)
}

export const useMrrLoaderStore = defineStore('mrr', () => {
    const root: Ref<MrObject | undefined> = ref ()

    async function loadFromFile(loadOptions: LoadOptions, parseOptions: ParseOptions = DEFAULT_PARSE_OPTIONS) {
        const mergedLoadOptions = _.merge({}, loadOptions)
        const mergedParseOptions = _.merge({}, parseOptions)

        const parseableObj = await loadMrrParseable(mergedLoadOptions)
        root.value = parseToMrr(parseableObj, mergedParseOptions)
    }

    async function exportAs(exportOptions: ExportOptions) {
        if (_.isNil(root.value)) {
            return ''
        }
        return await exportMrrAs(root.value as MrObject, exportOptions)
    }

    function $reset() {
        root.value = undefined
    }

    return {root, loadFromFile, exportAs, $reset}
})
