import {MrShaderAttribute} from "../mrr/shader/MrShaderAttribute"
import {MrAttributeKey} from "../mrr/mesh/MrAttributeKey";
import {ANAME_SHADER_MAP} from "./constants";

export function postShaderAttribute(name: string, attrKey: MrAttributeKey): MrShaderAttribute {
    const shaderAttrib = new MrShaderAttribute()
    shaderAttrib.index = attrKey.index
    shaderAttrib.attributeName = ANAME_SHADER_MAP[name]
    return shaderAttrib
}
