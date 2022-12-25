import merge from "lodash/merge";
import {objParser} from "./formats/objParser";
import {MrObject} from "./mrr/MrObject";
import {jsonWrite} from "./writer/jsonWriter";
import {cborHexWrite, cborWrite} from "./writer/cborWriter";

interface ParseOptions {
    format: 'obj'
}

interface ExportOptions {
    format: 'json' | 'cbor' | 'hexcbor',
    beauty?: boolean
}

const DEFAULT_PARSE_OPTIONS: ParseOptions = {
    format: "obj",
}

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
    format: "json",
    beauty: false
}

function _parseToMrr(data: string, options: ParseOptions = DEFAULT_PARSE_OPTIONS): MrObject {
    let result

    const mergedOptions = merge({}, DEFAULT_PARSE_OPTIONS, options)
    const {format} = mergedOptions

    switch (format) {
        case "obj":
            result = objParser(data)
            break
    }
    return result
}

function _exportAs(obj: MrObject, options: ExportOptions = DEFAULT_EXPORT_OPTIONS): string | Uint8Array {
    let result

    const mergedOptions = merge({}, DEFAULT_EXPORT_OPTIONS, options)
    const {format, beauty} = mergedOptions
    switch (format) {
        case "json":
            result = jsonWrite(obj, {beauty})
            break
        case "cbor":
            result = cborWrite(obj)
            break
        case "hexcbor":
            result = cborHexWrite(obj)
            break
    }
    return result
}

export function parseToMrr(data: string, options: ParseOptions = DEFAULT_PARSE_OPTIONS) {
    const result = _parseToMrr(data, options)
    return {
        mrRoot: result,
        exportAs: (options: ExportOptions) => _exportAs(result, options)
    }
}
