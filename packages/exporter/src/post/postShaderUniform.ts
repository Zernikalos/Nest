import {ZShaderUniform} from "../zernikalos/shader/ZShaderUniform";
import {UNAME_SHADER_MVP_MATRIX} from "./constants";
import {Zko} from "../proto";

export function postShaderUniform() {
    const uniform = new ZShaderUniform()
    uniform.uniformName = UNAME_SHADER_MVP_MATRIX
    uniform.type = Zko.ZkUniformType.MAT4
    uniform.count = 1
    return uniform
}
