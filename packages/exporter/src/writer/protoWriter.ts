import {MrObject} from "../mrr/MrObject"
import {Mrr} from "../proto";

function writeTree(obj: MrObject): Mrr.ProtoMrObject {
    let auxNode: Mrr.ProtoMrObject
    switch (obj.type) {
        case "Group":
        case "Object":
            auxNode = new Mrr.ProtoMrObject({
                type: "Group",
                group: Mrr.MrGroup.fromObject(obj)
            })
            break
        case "Model":
            auxNode = new Mrr.ProtoMrObject({
                type: "Model",
                model: Mrr.MrModel.fromObject(obj)
            })
            break
    }

    auxNode.children = obj.children.map((child) => writeTree(child))

    return auxNode
}

export function protoTree(root: MrObject): Mrr.ProtoMrObject {
    return writeTree(root)
}

export function protoWrite(root: MrObject): Uint8Array {
    const protoRoot = writeTree(root)

    return Mrr.ProtoMrObject.encode(protoRoot).finish()
}
