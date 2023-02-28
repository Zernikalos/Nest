import merge from "lodash/merge";
import {objParser} from "./formats/objParser";
import {MrObject} from "./mrr/MrObject";
import {jsonWrite} from "./writer/jsonWriter";
import {cborHexWrite, cborWrite} from "./writer/cborWriter";
import {gltfParser} from "./formats/gltfParser";

export interface ParseOptions {
    format: 'obj' | 'gltf'
}

export interface ExportOptions {
    format: 'json' | 'cbor' | 'hexcbor'
    beauty?: boolean
}

export interface ExportableMrObject {
    root: MrObject
    exportAs: (options: ExportOptions) => string | Uint8Array
}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {
    format: "obj",
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
    format: "json",
    beauty: false
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

export async function parseToMrr(data: string, options: ParseOptions = DEFAULT_PARSE_OPTIONS): Promise<ExportableMrObject> {
    const result = await _parseToMrr(data, options)
    return {
        root: result,
        exportAs: (options: ExportOptions) => _exportAs(result, options)
    }
}
