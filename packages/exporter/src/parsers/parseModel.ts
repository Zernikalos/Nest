import {Mesh} from "three"
import {parseMesh} from "./parseMesh"
import {MrModel} from "../mrr/MrModel"

export function parseModel(obj: Mesh): MrModel {
    const model = new MrModel()
    model.mesh = parseMesh(obj.geometry)

    return model
}
