import { ZkGroup } from "../zko/ZkGroup";
import {ZkObject} from "../zko/ZkObject"
import {parseGroup} from "./parseGroup"
import {parseModel} from "./parseModel"
import {isNil} from "lodash"
import {Group, Mesh, Object3D, Scene} from "three";
import {parseTransform} from "./parseTransform";
import {parseScene} from "./parseScene";

export function parseObject(threeObj: Object3D): ZkObject | undefined {
    let zkObj
    switch (threeObj.type) {
        case "Group":
            zkObj = parseGroup(threeObj as Group)
            break
        case "Mesh":
        case "SkinnedMesh":
            zkObj = parseModel(threeObj as Mesh)
            break
        case "Scene":
            zkObj = parseScene(threeObj as Scene)
            break
    }

    if (!zkObj || !zkObj.type) {
        console.warn(`Error detecting object of type ${threeObj.type}, setting a default ZkObject`)
        // TODO: Fix this type
        zkObj = new ZkGroup()
    }
    zkObj.name = threeObj.name
    zkObj.transform = parseTransform(threeObj)

    zkObj.children = threeObj.children
        .map((child: Object3D)=> parseObject(child))
        .filter((child: ZkObject) => !isNil(child))
    return zkObj
}
