import {MrShaderUniform} from "../mrr/shader/MrShaderUniform";
import {UNAME_MVP_MATRIX} from "./common";

export function postShaderUniform() {
    const uniform = new MrShaderUniform()
    uniform.uniformName = UNAME_MVP_MATRIX
    uniform.type = "mat4"
    uniform.count = 1
    return uniform
}
