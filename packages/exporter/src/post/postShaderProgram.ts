import {MrShaderProgram} from "../mrr/shader/MrShaderProgram"
import {postShader} from "./postShader"
import {MrModel} from "../mrr/MrModel";
import {postShaderAttribute} from "./postShaderAttribute";
import {postShaderUniform} from "./postShaderUniform";

export function postShaderProgram(obj: MrModel): MrShaderProgram {
    const shaderProgram = new MrShaderProgram()
    shaderProgram.vertexShader = postShader("vertex", obj)
    shaderProgram.fragmentShader = postShader("fragment", obj)

    obj.mesh.attributeKeysMap.forEach((attrKey, name) => {
        const attr = postShaderAttribute(name, attrKey)
        shaderProgram.setAttribute(name, attr)
    })

    shaderProgram.setUniform("ModelViewProjection", postShaderUniform())

    return shaderProgram
}
