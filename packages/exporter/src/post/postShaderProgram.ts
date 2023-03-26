import {ZModel} from "../zernikalos/ZModel";
import {ZShaderProgram} from "../zernikalos/shader/ZShaderProgram"
import {postShader} from "./postShader"
import {postShaderAttribute} from "./postShaderAttribute";
import {postShaderUniform} from "./postShaderUniform";

export function postShaderProgram(obj: ZModel): ZShaderProgram {
    const shaderProgram = new ZShaderProgram()
    shaderProgram.vertexShader = postShader("vertex", obj)
    shaderProgram.fragmentShader = postShader("fragment", obj)

    obj.mesh.attributeKeysMap.forEach((attrKey, name) => {
        const attr = postShaderAttribute(name, attrKey)
        shaderProgram.setAttribute(name, attr)
    })

    shaderProgram.setUniform("ModelViewProjection", postShaderUniform())

    return shaderProgram
}
