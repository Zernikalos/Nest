import {ZShader} from "./ZShader"
import {ZShaderAttribute} from "./ZShaderAttribute"
import {ZShaderUniform} from "./ZShaderUniform";

export class ZShaderProgram {
    vertexShader: ZShader
    fragmentShader: ZShader

    private _attributes: Map<string, ZShaderAttribute> = new Map()
    private _uniforms: Map<string, ZShaderUniform> = new Map()

    public get attributes(): {[key: string]: ZShaderAttribute} {
        return Object.fromEntries(this._attributes)
    }

    public get uniforms(): {[key: string]: ZShaderUniform} {
        return Object.fromEntries(this._uniforms)
    }

    public setAttribute(key: string, attr: ZShaderAttribute) {
        this._attributes.set(key, attr)
    }

    public setUniform(key: string, unif: ZShaderUniform) {
        this._uniforms.set(key, unif)
    }

}

