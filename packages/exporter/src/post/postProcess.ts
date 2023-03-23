import {ZkObject} from "../zko/ZkObject"
import {ZkModel} from "../zko/ZkModel"
import {isNil} from "lodash"
import {postModel} from "./postModel"

export function postProcess(obj: ZkObject) {
    let postObj: ZkObject
    switch (obj.type) {
        case "Object":
        case "Group":
            postObj = obj
            break
        case "Model":
            postObj = postModel(obj as ZkModel)
            break
    }
    if (!postObj || !postObj.type) {
        console.error("Error POST processing ZkObject instance")
        return
    }
    postObj.children = obj.children
        .map((child: ZkObject)=> postProcess(child))
        .filter((child: ZkObject) => !isNil(child))
    return postObj
}
