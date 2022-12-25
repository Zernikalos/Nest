import {MrObject} from "../mrr/MrObject"

function jsonReplacer(_key: string, value: any) {
    if (value instanceof Map) {
        return Object.fromEntries(value)
    }
    if (ArrayBuffer.isView(value)) {
        //@ts-ignore
        return Array.from(value)
    }
    return value
}

export function jsonWrite(node: MrObject, {beauty}: {beauty?: boolean}): string {
    const padding = beauty ? 4 : null
    const json = JSON.stringify(node, jsonReplacer, padding)
    return json
}
