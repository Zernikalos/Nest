import {BufferGeometry} from "three"
// import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import {parseAttributeKeys} from "./parseAttributeKeys"
import {MrMesh} from "../mrr/MrMesh"
import {MrVertexBuffer} from "../mrr/MrVertexBuffer";

export function parseMesh(geometry: BufferGeometry) {
    // const b = BufferGeometryUtils
    // BufferGeometryUtils.mergeBufferAttributes(geometry.attributes)

    const mesh = new MrMesh()

    mesh.attributeKeys = parseAttributeKeys(geometry)

    // @ts-ignore
    mesh.indices.dataArray = geometry.index?.array.buffer > 0 ? new Int8Array(geometry.index?.array.buffer) : new Int8Array([])
    for (const [key, attr] of Object.entries(geometry.attributes)) {
        // @ts-ignore
        const data = new Int8Array(attr.array.buffer)
        const vertexBuffer = new MrVertexBuffer()
        vertexBuffer.dataArray = data
        mesh.vertices.set(key, vertexBuffer)
    }

    return mesh
}
