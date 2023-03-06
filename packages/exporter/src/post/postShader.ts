import {MrShader, ShaderType} from "../mrr/shader/MrShader"
import {MrModel} from "../mrr/MrModel";
import {generateVertexShaderSource} from "./shadersourcegenerator";
import {generateFragmentShaderSource} from "./shadersourcegenerator/generateFragmentShaderSource";

export function postShader(type: ShaderType, obj: MrModel): MrShader {
    const shader = new MrShader()
    shader.type = type
    if (type === "vertex") {
        shader.source = generateVertexShaderSource(obj)
    } else {
        shader.source = generateFragmentShaderSource(obj)
    }
    return shader
}
