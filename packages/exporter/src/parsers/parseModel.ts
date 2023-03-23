import {Mesh} from "three"
import {parseMesh} from "./parseMesh"
import {ZkModel} from "../zko/ZkModel"

export function parseModel(obj: Mesh): ZkModel {
    const model = new ZkModel()
    model.mesh = parseMesh(obj.geometry)

    return model
}
