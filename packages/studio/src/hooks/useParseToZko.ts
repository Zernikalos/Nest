import {
    zkLoad,
    zkParse,
    zkExport,
    LoadOptions,
    ParseOptions,
    ExportOptions,
    ZkoParseableObject,
    ZObject
} from "@zernikalos/exporter"
import {merge} from "lodash"

export async function load3DFile(loadOptions: LoadOptions): Promise<ZkoParseableObject> {
    const mergedOptions = merge({}, loadOptions)
    return await zkLoad(mergedOptions)
}

export function parseMrr(parseableObject: ZkoParseableObject, parseOptions?: ParseOptions): ZObject {
    const mergeParseOptions: ParseOptions = merge({}, parseOptions)
    return zkParse(parseableObject, mergeParseOptions)
}

export function exportAs(mrObject: ZObject, exportOptions?: ExportOptions) {
    const mergedExportOptions: ExportOptions = merge({}, exportOptions)
    return zkExport(mrObject, mergedExportOptions)
}
