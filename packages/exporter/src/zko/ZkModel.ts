import {ZkObject, ZkObjectType} from "./ZkObject"
import {ZkMesh} from "./mesh/ZkMesh"
import {ZkShaderProgram} from "./shader/ZkShaderProgram"

export class ZkModel extends ZkObject {
    type: ZkObjectType = "Model"
    mesh = new ZkMesh()
    shaderProgram: ZkShaderProgram
}



