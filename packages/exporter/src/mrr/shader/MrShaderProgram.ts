import {MrShader} from "./MrShader"
import {MrShaderAttribute} from "./MrShaderAttribute"
import {MrShaderUniform} from "./MrShaderUniform";

export class MrShaderProgram {
    vertexShader: MrShader
    fragmentShader: MrShader

    private _attributes: Map<string, MrShaderAttribute> = new Map()
    private _uniforms: Map<string, MrShaderUniform> = new Map()

    public get attributes(): {[key: string]: MrShaderAttribute} {
        return Object.fromEntries(this._attributes)
    }

    public get uniforms(): {[key: string]: MrShaderUniform} {
        return Object.fromEntries(this._uniforms)
    }

    public setAttribute(key: string, attr: MrShaderAttribute) {
        this._attributes.set(key, attr)
    }

    public setUniform(key: string, unif: MrShaderUniform) {
        this._uniforms.set(key, unif)
    }

}

