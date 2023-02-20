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
            mrrObj = parseModel(threeObj as Mesh)
            break
    }

    mrrObj.transform = parseTransform(threeObj)

    if (!mrrObj || !mrrObj.type) {
        console.error("Error parsing node")
        return
    }
    mrrObj.children = threeObj.children
        .map((child: Object3D)=> parseObject(child))
        .filter((child: MrObject) => !isNil(child))
    return mrrObj
}
