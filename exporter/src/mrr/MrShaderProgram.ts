import {MrShader} from "./MrShader"
import {MrShaderAttribute} from "./MrShaderAttribute"

export class MrShaderProgram {
    vertexShader: MrShader
    fragmentShader: MrShader

    attributes: Map<string, MrShaderAttribute> = new Map()
}

