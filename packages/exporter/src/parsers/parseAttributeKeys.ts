import {BufferAttribute, BufferGeometry, InterleavedBufferAttribute} from "three"
import {isNil} from "lodash"
import {MrAttributeKey} from "../mrr/mesh/MrAttributeKey"

function parseAttributeKey(attr: BufferAttribute | InterleavedBufferAttribute): MrAttributeKey {
    if (isNil(attr)) {
        return new MrAttributeKey()
    }
    const attribute = new MrAttributeKey()
    attribute.size = attr.itemSize
    attribute.count = attr.count
    attribute.normalized = attr.normalized
    attribute.offset = (attr as BufferAttribute)?.updateRange?.offset ?? 0
    attribute.stride = (attr as InterleavedBufferAttribute)?.data?.stride ?? 0
    return attribute
}

export function parseAttributeKeys(geometry: BufferGeometry): Map<string, MrAttributeKey> {
    const keys = new Map()
    for (const [key, attr] of Object.entries(geometry.attributes)) {
        if (attr instanceof BufferAttribute || attr instanceof InterleavedBufferAttribute) {
            const parsedAttr = parseAttributeKey(attr)
            keys.set(key, parsedAttr)
        }
    }
    return keys
}
