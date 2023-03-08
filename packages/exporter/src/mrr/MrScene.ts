import {MrObject, MrObjectType} from "./MrObject";
import {MrColor} from "./MrColor";

export class MrScene extends MrObject {
    type: MrObjectType = "Scene"
    clearColor: MrColor = new MrColor(0.5, 0.5, 0.5, 0.5)
}
