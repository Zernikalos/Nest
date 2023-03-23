import {ZkModel} from "../zko/ZkModel"
import {postShaderProgram} from "./postShaderProgram"

export function postModel(obj: ZkModel): ZkModel {
    obj.shaderProgram = postShaderProgram(obj)
    return obj
}
