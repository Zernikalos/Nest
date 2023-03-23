import {ZkShader, ShaderType} from "../zko/shader/ZkShader"
import {ZkModel} from "../zko/ZkModel";
import {generateVertexShaderSource} from "./shadersourcegenerator";
import {generateFragmentShaderSource} from "./shadersourcegenerator/generateFragmentShaderSource";

export function postShader(type: ShaderType, obj: ZkModel): ZkShader {
    const shader = new ZkShader()
    shader.type = type
    if (type === "vertex") {
        shader.source = generateVertexShaderSource(obj)
    } else {
        shader.source = generateFragmentShaderSource(obj)
    }
    return shader
}
