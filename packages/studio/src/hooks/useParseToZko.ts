import {
    loadZkoParseable,
    parseToZko,
    exportZkoAs,
    LoadOptions,
    ParseOptions,
    ExportOptions,
    ZkoParseableObject,
    ZkObject
} from "@zernikalos/exporter"
import {merge} from "lodash"

export async function load3DFile(loadOptions: LoadOptions): Promise<ZkoParseableObject> {
    const mergedOptions = merge({}, loadOptions)
    return await loadZkoParseable(mergedOptions)
}

export function parseMrr(parseableObject: ZkoParseableObject, parseOptions?: ParseOptions): ZkObject {
    const mergeParseOptions: ParseOptions = merge({}, parseOptions)
    return parseToZko(parseableObject, mergeParseOptions)
}

export function exportAs(mrObject: ZkObject, exportOptions?: ExportOptions) {
    const mergedExportOptions: ExportOptions = merge({}, exportOptions)
    return exportZkoAs(mrObject, mergedExportOptions)
}
