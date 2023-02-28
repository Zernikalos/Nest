import {DEFAULT_EXPORT_OPTIONS, DEFAULT_PARSE_OPTIONS, parseToMrr} from "@mrrobotto/exporter"
import {merge} from "lodash"

export default async function (filePath: string, exportOptions?: any) {
    const mergedExportOptions = merge({}, DEFAULT_EXPORT_OPTIONS, exportOptions)
    return (await parseToMrr(filePath, {format: "obj"})).exportAs(mergedExportOptions)
}

export async function parseMrr(filePath: string, parseOptions?: any) {
    const mergeParseOptions = merge({}, DEFAULT_PARSE_OPTIONS, parseOptions)
    return await parseToMrr(filePath, mergeParseOptions)
}

export function exportAs(exportableMrObject: any, exportOptions?: any) {
    const mergedExportOptions = merge({}, DEFAULT_EXPORT_OPTIONS, exportOptions)
    return exportableMrObject.exportAs(mergedExportOptions)
}
