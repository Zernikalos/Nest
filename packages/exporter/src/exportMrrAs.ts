import {MrObject} from "./mrr/MrObject";
import {buf2hex} from "./utils/buf2hex";
import merge from "lodash/merge";
import {jsonWrite} from "./writer/jsonWriter";
import {protoWrite} from "./writer/protoWriter";

export interface ExportOptions {
    format: 'json' | 'proto'
    beauty?: boolean
    stringify?: boolean
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
    format: "json",
    beauty: false,
    stringify: false
}

export async function exportMrrAs(mrrObj: MrObject, options: ExportOptions = DEFAULT_EXPORT_OPTIONS) {
    let result

    const mergedOptions = merge({}, DEFAULT_EXPORT_OPTIONS, options)
    const {format, beauty} = mergedOptions
    switch (format) {
        case "json":
            result = await jsonWrite(mrrObj, {beauty})
            break
        case "proto":
            result = await protoWrite(mrrObj)
            break
    }
    if (options.stringify) {
        result = stringify(result)
    }
    return result
}

function stringify(parsed: string | Uint8Array): string {
    if (typeof parsed === 'string') {
        return parsed
    } else if (parsed instanceof Uint8Array) {
        return buf2hex(parsed)
    }
}
