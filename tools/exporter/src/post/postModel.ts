import {MrModel} from "../mrr/MrModel";
import {postShaderProgram} from "./postShaderProgram";

export function postModel(obj: MrModel): MrModel {
    obj.shaderProgram = postShaderProgram()
    return obj
}
