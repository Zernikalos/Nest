import {MrObject} from "../mrr/MrObject"
import {parseGroup} from "./parseGroup"
import {parseModel} from "./parseModel"
import {isNil} from "lodash"
import {Group, Mesh, Object3D} from "three";
import {parseTransform} from "./parseTransform";

export function parseObject(threeObj: Object3D): MrObject | undefined {
    let mrrObj
    switch (threeObj.type) {
        case "Group":
            mrrObj = parseGroup(threeObj as Group)
            break
        case "Mesh":
        case "SkinnedMesh":
            mrrObj = parseModel(threeObj as Mesh)
            break
    }

    if (!mrrObj || !mrrObj.type) {
        console.warn(`Error detecting object of type ${threeObj.type}, setting a default MrObject`)
        mrrObj = new MrObject()
    }
    mrrObj.name = threeObj.name
    mrrObj.transform = parseTransform(threeObj)

    mrrObj.children = threeObj.children
        .map((child: Object3D)=> parseObject(child))
        .filter((child: MrObject) => !isNil(child))
    return mrrObj
}
