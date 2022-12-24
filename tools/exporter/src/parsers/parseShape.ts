import {BufferGeometry} from "three";
import {MrShape} from "../mrr/MrShape";

export function parseShape(geometry: BufferGeometry): MrShape {
    const shape = new MrShape()

    shape.indices = geometry.index?.array || []
    for (const [key, attr] of Object.entries(geometry.attributes)) {
        // @ts-ignore
        const data = new Int8Array(attr.array.buffer)
        shape.vertices.set(key, data)
    }

    return shape
}
