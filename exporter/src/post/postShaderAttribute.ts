import {MrShaderAttribute} from "../mrr/shader/MrShaderAttribute"
import {MrAttributeKey} from "../mrr/mesh/MrAttributeKey";
import {ATTRIB_MAP} from "./common";

export function postShaderAttribute(name: string, attrKey: MrAttributeKey): MrShaderAttribute {
    const shaderAttrib = new MrShaderAttribute()
    shaderAttrib.index = attrKey.index
    shaderAttrib.attributeName = ATTRIB_MAP[name]
    return shaderAttrib
}
