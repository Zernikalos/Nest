import {ZShaderUniform} from "../zernikalos/shader/ZShaderUniform";
import {Zko} from "../proto";
import {UNAME_SHADER_MAP} from "./constants";

export function postShaderUniform(uniformName: string) {
    const uniform = new ZShaderUniform()
    uniform.uniformName = UNAME_SHADER_MAP[uniformName]
    uniform.type = Zko.ZkUniformType.MAT4
    uniform.count = 1
    return uniform
}
