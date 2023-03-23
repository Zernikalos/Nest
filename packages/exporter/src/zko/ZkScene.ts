import {ZkObject, ZkObjectType} from "./ZkObject";
import {ZkColor} from "./ZkColor";

export class ZkScene extends ZkObject {
    type: ZkObjectType = "Scene"
    clearColor: ZkColor = new ZkColor(0.5, 0.5, 0.5, 0.5)
}
