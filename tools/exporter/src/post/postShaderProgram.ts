import {MrShaderProgram} from "../mrr/MrShaderProgram"
import {postShader} from "./postShader"

export function postShaderProgram(): MrShaderProgram {
    const shaderProgram = new MrShaderProgram()
    shaderProgram.vertexShader = postShader("vertex")
    shaderProgram.fragmentShader = postShader("fragment")

    return shaderProgram
}
