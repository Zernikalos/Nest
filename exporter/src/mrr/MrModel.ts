import {MrObject, MrObjectType} from "./MrObject"
import {MrMesh} from "./mesh/MrMesh"
import {MrShaderProgram} from "./shader/MrShaderProgram"

export class MrModel extends MrObject {
    type: MrObjectType = "Model"
    mesh = new MrMesh()
    shaderProgram: MrShaderProgram
}



