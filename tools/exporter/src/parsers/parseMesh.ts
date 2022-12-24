import {BufferGeometry} from "three"
// import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import {parseAttributeKeys} from "./parseAttributeKeys"
import {MrMesh} from "../mrr/MrMesh"
import {parseShape} from "./parseShape";

export function parseMesh(geometry: BufferGeometry) {
    // const b = BufferGeometryUtils
    // BufferGeometryUtils.mergeBufferAttributes(geometry.attributes)

    const mesh = new MrMesh()

    mesh.attributes = parseAttributeKeys(geometry)
    mesh.shape = parseShape(geometry)
    return mesh
}
