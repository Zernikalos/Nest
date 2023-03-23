import {ZkShaderAttribute} from "../zko/shader/ZkShaderAttribute"
import {ZkAttributeKey} from "../zko/mesh/ZkAttributeKey";
import {ANAME_SHADER_MAP} from "./constants";

export function postShaderAttribute(name: string, attrKey: ZkAttributeKey): ZkShaderAttribute {
    const shaderAttrib = new ZkShaderAttribute()
    shaderAttrib.index = attrKey.index
    shaderAttrib.attributeName = ANAME_SHADER_MAP[name]
    return shaderAttrib
}
