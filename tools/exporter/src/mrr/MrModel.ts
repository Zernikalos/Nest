import {MrObject, MrObjectType} from "./MrObject"
import {MrMesh} from "./MrMesh"
import {MrShaderProgram} from "./MrShaderProgram"

export class MrModel extends MrObject {
    type: MrObjectType = "Model"
    mesh = new MrMesh()
    shaderProgram: MrShaderProgram
}



