import {MrObject} from "../mrr/MrObject"
import {parseGroup} from "./parseGroup"
import {parseModel} from "./parseModel"
import {isNil} from "lodash"

export function parseObject(threeObj: any): MrObject | undefined {
    let mrrObj
    switch (threeObj.type) {
        case "Group":
            mrrObj = parseGroup(threeObj)
            break
        case "Mesh":
            mrrObj = parseModel(threeObj)
            break
    }
    if (!mrrObj || !mrrObj.type) {
        console.error("Error parsing node")
        return
    }
    mrrObj.children = threeObj.children
        .map((child: MrObject)=> parseObject(child))
        .filter((child: MrObject) => !isNil(child))
    return mrrObj
}
