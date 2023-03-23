import {ZkModel} from "../zko/ZkModel";
import {ZkShaderProgram} from "../zko/shader/ZkShaderProgram"
import {postShader} from "./postShader"
import {postShaderAttribute} from "./postShaderAttribute";
import {postShaderUniform} from "./postShaderUniform";

export function postShaderProgram(obj: ZkModel): ZkShaderProgram {
    const shaderProgram = new ZkShaderProgram()
    shaderProgram.vertexShader = postShader("vertex", obj)
    shaderProgram.fragmentShader = postShader("fragment", obj)

    obj.mesh.attributeKeysMap.forEach((attrKey, name) => {
        const attr = postShaderAttribute(name, attrKey)
        shaderProgram.setAttribute(name, attr)
    })

    shaderProgram.setUniform("ModelViewProjection", postShaderUniform())

    return shaderProgram
}
