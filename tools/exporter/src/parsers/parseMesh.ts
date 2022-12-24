import {BufferGeometry} from "three"
// import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import {parseAttribute} from "./parseAttribute"
import {MrMesh} from "../mrr/MrMesh"

export function parseMesh(geometry: BufferGeometry) {
    // const b = BufferGeometryUtils
    // BufferGeometryUtils.mergeBufferAttributes(geometry.attributes)

    const position = parseAttribute("position", geometry.attributes.position)
    const normal = parseAttribute("normal", geometry.attributes.normal)
    const uv = parseAttribute("uv", geometry.attributes.uv)

    const mesh = new MrMesh()
    mesh.attributes.set("position", position)
    mesh.attributes.set("normal", normal)
    mesh.attributes.set("uv", uv)

    mesh.indices = geometry.index?.array || []
    return mesh
}
