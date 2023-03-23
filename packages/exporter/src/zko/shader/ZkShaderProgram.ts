import {ZkShader} from "./ZkShader"
import {ZkShaderAttribute} from "./ZkShaderAttribute"
import {ZkShaderUniform} from "./ZkShaderUniform";

export class ZkShaderProgram {
    vertexShader: ZkShader
    fragmentShader: ZkShader

    private _attributes: Map<string, ZkShaderAttribute> = new Map()
    private _uniforms: Map<string, ZkShaderUniform> = new Map()

    public get attributes(): {[key: string]: ZkShaderAttribute} {
        return Object.fromEntries(this._attributes)
    }

    public get uniforms(): {[key: string]: ZkShaderUniform} {
        return Object.fromEntries(this._uniforms)
    }

    public setAttribute(key: string, attr: ZkShaderAttribute) {
        this._attributes.set(key, attr)
    }

    public setUniform(key: string, unif: ZkShaderUniform) {
        this._uniforms.set(key, unif)
    }

}

