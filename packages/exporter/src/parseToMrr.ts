import merge from "lodash/merge";
import {objParser} from "./formats/objParser";
import {MrObject} from "./mrr/MrObject";
import {jsonWrite} from "./writer/jsonWriter";
import {gltfParser} from "./formats/gltfParser";
import {buf2hex} from "./utils/buf2hex";
import {protoWrite} from "./writer/protoWriter";

export interface ParseOptions {
    format: 'obj' | 'gltf'
}

export interface ExportOptions {
    format: 'json' | 'proto'
    beauty?: boolean
    stringify?: boolean
}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {
    format: "obj",
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
    format: "json",
    beauty: false,
    stringify: false
}

export interface ExportableMrObject {
    root: MrObject
    exportAs(options: ExportOptions): string | Uint8Array
}

async function _parseToMrr(filePath: string, options: ParseOptions = DEFAULT_PARSE_OPTIONS): Promise<MrObject> {
    let result

    const mergedOptions = merge({}, DEFAULT_PARSE_OPTIONS, options)
    const {format} = mergedOptions

    switch (format) {
        case "obj":
            result = await objParser(filePath)
            break
        case "gltf":
            result = await gltfParser(filePath)
            break
    }
    return result
}

export function exportAs(obj: MrObject, options: ExportOptions = DEFAULT_EXPORT_OPTIONS): string | Uint8Array {

    function stringify(parsed: string | Uint8Array): string {
        if (typeof parsed === 'string') {
            return parsed
        } else if (parsed instanceof Uint8Array) {
            return buf2hex(parsed)
        }
    }

    let result

    const mergedOptions = merge({}, DEFAULT_EXPORT_OPTIONS, options)
    const {format, beauty} = mergedOptions
    switch (format) {
        case "json":
            result = jsonWrite(obj, {beauty})
            break
        case "proto":
            result = protoWrite(obj)
            break
    }
    if (options.stringify) {
        result = stringify(result)
    }
    return result
}

export async function parseToMrr(data: string, options?: ParseOptions): Promise<ExportableMrObject> {
    const result = await _parseToMrr(data, options)
    return {
        root: result,
        exportAs: (options: ExportOptions) => exportAs(result, options)
    }
}
