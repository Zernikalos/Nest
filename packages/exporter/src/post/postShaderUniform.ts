import {MrShaderUniform} from "../mrr/shader/MrShaderUniform";
import {UNAME_SHADER_MVP_MATRIX} from "./constants";
import {Mrr} from "../proto";

export function postShaderUniform() {
    const uniform = new MrShaderUniform()
    uniform.uniformName = UNAME_SHADER_MVP_MATRIX
    uniform.type = Mrr.MrUniformType.MAT4
    uniform.count = 1
    return uniform
}
