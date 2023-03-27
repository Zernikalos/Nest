import {ZModel} from "../zernikalos/ZModel";
import {ZShaderProgram} from "../zernikalos/shader/ZShaderProgram"
import {postShader} from "./postShader"
import {postShaderAttribute} from "./postShaderAttribute";
import {postShaderUniform} from "./postShaderUniform";
import {UNAME_PROJECTION_MATRIX, UNAME_VIEW_MODEL_MATRIX} from "../constants";

export function postShaderProgram(obj: ZModel): ZShaderProgram {
    const shaderProgram = new ZShaderProgram()
    shaderProgram.vertexShader = postShader("vertex", obj)
    shaderProgram.fragmentShader = postShader("fragment", obj)

    obj.mesh.attributeKeysMap.forEach((attrKey, name) => {
        const attr = postShaderAttribute(name, attrKey)
        shaderProgram.setAttribute(name, attr)
    })

    shaderProgram.setUniform(UNAME_VIEW_MODEL_MATRIX, postShaderUniform(UNAME_VIEW_MODEL_MATRIX))
    shaderProgram.setUniform(UNAME_PROJECTION_MATRIX, postShaderUniform(UNAME_PROJECTION_MATRIX))

    return shaderProgram
}
