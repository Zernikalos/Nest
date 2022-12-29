import {MrShaderProgram} from "../mrr/MrShaderProgram"
import {postShader} from "./postShader"
import {MrModel} from "../mrr/MrModel";

export function postShaderProgram(obj: MrModel): MrShaderProgram {
    const shaderProgram = new MrShaderProgram()
    shaderProgram.vertexShader = postShader("vertex", obj)
    shaderProgram.fragmentShader = postShader("fragment", obj)

    return shaderProgram
}
