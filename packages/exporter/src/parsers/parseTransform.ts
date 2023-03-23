import {Object3D} from "three";
import {ZkTransform} from "../zko/ZkTransform";
import {ZkVector3} from "../zko/math/ZkVector3";
import {ZkQuaternion} from "../zko/math/ZkQuaternion";

export function parseTransform(obj: Object3D): ZkTransform {
    const transform = new ZkTransform()

    const position = obj.position
    transform.location = new ZkVector3(position.x, position.y, position.z)

    const quaternion = obj.quaternion
    transform.rotation = new ZkQuaternion(quaternion.w, quaternion.x, quaternion.y, quaternion.z)

    const scale = obj.scale
    transform.scale = new ZkVector3(scale.x, scale.y, scale.z)

    return transform
}
