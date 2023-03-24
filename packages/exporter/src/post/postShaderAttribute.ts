import {ZShaderAttribute} from "../zernikalos/shader/ZShaderAttribute"
import {ZAttributeKey} from "../zernikalos/mesh/ZAttributeKey";
import {ANAME_SHADER_MAP} from "./constants";

export function postShaderAttribute(name: string, attrKey: ZAttributeKey): ZShaderAttribute {
    const shaderAttrib = new ZShaderAttribute()
    shaderAttrib.index = attrKey.index
    shaderAttrib.attributeName = ANAME_SHADER_MAP[name]
    return shaderAttrib
}
