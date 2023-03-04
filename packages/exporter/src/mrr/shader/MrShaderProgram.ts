import {MrShader} from "./MrShader"
import {MrShaderAttribute} from "./MrShaderAttribute"
import {MrShaderUniform} from "./MrShaderUniform";

export class MrShaderProgram {
    vertexShader: MrShader
    fragmentShader: MrShader

    attributes: {[key: string]: MrShaderAttribute} = {}
    uniforms: {[key: string]: MrShaderUniform} = {}
}

