import {ZModel} from "../zernikalos/ZModel"
import {postShaderProgram} from "./postShaderProgram"

export function postModel(obj: ZModel): ZModel {
    obj.shaderProgram = postShaderProgram(obj)
    return obj
}
