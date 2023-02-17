import {MrShader, ShaderType} from "../mrr/shader/MrShader"
import {MrModel} from "../mrr/MrModel";
import {generateVertexShaderSource} from "./shadersourcegenerator";

export function postShader(type: ShaderType, obj: MrModel): MrShader {
    const shader = new MrShader()
    shader.type = type
    if (type === "vertex") {
        shader.source = generateVertexShaderSource(obj)
    } else {
        shader.source = fragmentShaderSource
    }
    return shader
}

const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(0.5, 0.5, 0.5, 1);
}
`
