import {MrObject} from "../mrr/MrObject"
import {isNil} from "lodash"
import {postModel} from "./postModel"
import {MrModel} from "../mrr/MrModel"

export function postProcess(obj: MrObject) {
    let postObj: MrObject
    switch (obj.type) {
        case "Object":
        case "Group":
            postObj = obj
            break
        case "Model":
            postObj = postModel(obj as MrModel)
            break
    }
    if (!postObj || !postObj.type) {
        console.error("Error POST processing MrObject instance")
        return
    }
    postObj.children = obj.children
        .map((child: MrObject)=> postProcess(child))
        .filter((child: MrObject) => !isNil(child))
    return postObj
}
