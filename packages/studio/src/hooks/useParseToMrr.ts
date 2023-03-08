import {
    loadMrrParseable,
    parseToMrr,
    exportMrrAs,
    LoadOptions,
    ParseOptions,
    ExportOptions,
    MrrParseableObject,
    MrObject
} from "@mrrobotto/exporter"
import {merge} from "lodash"

export async function load3DFile(loadOptions: LoadOptions): Promise<MrrParseableObject> {
    const mergedOptions = merge({}, loadOptions)
    return await loadMrrParseable(mergedOptions)
}

export function parseMrr(parseableObject: MrrParseableObject, parseOptions?: ParseOptions): MrObject {
    const mergeParseOptions: ParseOptions = merge({}, parseOptions)
    return parseToMrr(parseableObject, mergeParseOptions)
}

export function exportAs(mrObject: MrObject, exportOptions?: ExportOptions) {
    const mergedExportOptions: ExportOptions = merge({}, exportOptions)
    return exportMrrAs(mrObject, mergedExportOptions)
}
