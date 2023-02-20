import {Object3D} from "three";
import {MrTransform} from "../mrr/MrTransform";
import {MrVector3} from "../mrr/math/MrVector3";
import {MrQuaternion} from "../mrr/math/MrQuaternion";

export function parseTransform(obj: Object3D): MrTransform {
    const transform = new MrTransform()

    const position = obj.position
    transform.location = new MrVector3(position.x, position.y, position.z)

    const quaternion = obj.quaternion
    transform.rotation = new MrQuaternion(quaternion.w, quaternion.x, quaternion.y, quaternion.z)

    const scale = obj.scale
    transform.scale = new MrVector3(scale.x, scale.y, scale.z)

    return transform
}
