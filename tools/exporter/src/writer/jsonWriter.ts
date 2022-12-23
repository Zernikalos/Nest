import {MrObject} from "../mrr/MrObject";

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

export function jsonWrite(node: MrObject): string {
    const json = JSON.stringify(node, jsonReplacer);
    return json
}
