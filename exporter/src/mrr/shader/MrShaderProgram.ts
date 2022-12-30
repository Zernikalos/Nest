import {MrShader} from "./MrShader"
import {MrShaderAttribute} from "./MrShaderAttribute"
import {MrShaderUniform} from "./MrShaderUniform";

export class MrShaderProgram {
    vertexShader: MrShader
    fragmentShader: MrShader

    attributes: Map<string, MrShaderAttribute> = new Map()
    uniforms: Map<string, MrShaderUniform> = new Map()
}

