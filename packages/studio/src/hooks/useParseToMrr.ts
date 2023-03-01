import {
    DEFAULT_EXPORT_OPTIONS,
    DEFAULT_PARSE_OPTIONS,
    ExportableMrObject,
    ExportOptions,
    ParseOptions,
    parseToMrr
} from "@mrrobotto/exporter"
import {merge} from "lodash"

export async function parseMrr(filePath: string, parseOptions?: ParseOptions) {
    const mergeParseOptions = merge({}, DEFAULT_PARSE_OPTIONS, parseOptions)
    return await parseToMrr(filePath, mergeParseOptions)
}

export function exportAs(exportableMrObject: ExportableMrObject, exportOptions?: ExportOptions) {
    const mergedExportOptions = merge({}, DEFAULT_EXPORT_OPTIONS, exportOptions)
    return exportableMrObject.exportAs(mergedExportOptions)
}
