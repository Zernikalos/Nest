import {MrShaderUniform} from "../mrr/shader/MrShaderUniform";
import {UNAME_SHADER_MVP_MATRIX} from "./constants";

export function postShaderUniform() {
    const uniform = new MrShaderUniform()
    uniform.uniformName = UNAME_SHADER_MVP_MATRIX
    uniform.type = "mat4"
    uniform.count = 1
    return uniform
}
