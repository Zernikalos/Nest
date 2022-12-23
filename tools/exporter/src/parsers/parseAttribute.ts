import {BufferAttribute, InterleavedBufferAttribute} from "three";
import {isNil} from "lodash";
import {MrAttribute} from "../mrr/MrAttribute";

export function parseAttribute(name: string, attr: InterleavedBufferAttribute | BufferAttribute): MrAttribute {
    if (isNil(attr)) {
        return new MrAttribute()
    }
    const attribute = new MrAttribute()
    attribute.name = name
    attribute.size = attr.itemSize
    attribute.count = attr.count
    attribute.data = attr.array
    return attribute
}
