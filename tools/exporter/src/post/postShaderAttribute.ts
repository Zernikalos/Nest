import {MrShaderAttribute} from "../mrr/MrShaderAttribute";

export function postShaderAttribute(): MrShaderAttribute {
    const shaderAttrib = new MrShaderAttribute()
    shaderAttrib.name = "vertices"
    shaderAttrib.index = 0
    shaderAttrib.attrName = "a_position"
    return shaderAttrib
}
