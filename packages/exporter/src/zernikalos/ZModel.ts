import {ZObject, ZObjectType} from "./ZObject"
import {ZMesh} from "./mesh/ZMesh"
import {ZShaderProgram} from "./shader/ZShaderProgram"

export class ZModel extends ZObject {
    type: ZObjectType = "Model"
    mesh = new ZMesh()
    shaderProgram: ZShaderProgram
}



