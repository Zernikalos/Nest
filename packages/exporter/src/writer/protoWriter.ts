import {MrObject} from "../mrr/MrObject"
import {Mrr} from "../proto"

async function writeTree(obj: MrObject): Promise<Mrr.ProtoMrObject> {
    const auxNode: Mrr.ProtoMrObject = await promisedConverToProto(obj)

    auxNode.children = await Promise.all(obj.children.map(async (child) => await writeTree(child)))

    return auxNode
}

function convertToProto(obj: MrObject) {
    // TODO: The use of fromObject affects a lot to the performance
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
    return auxNode
}

function promisedConverToProto(obj: MrObject): Promise<Mrr.ProtoMrObject> {
    return new Promise(resolve => {
        setTimeout(() =>{
            resolve(convertToProto(obj))
        })
    })
}

export async function protoTree(root: MrObject): Promise<Mrr.ProtoMrObject> {
    return await writeTree(root)
}

export async function protoWrite(root: MrObject): Promise<Uint8Array> {
    const protoRoot = await writeTree(root)

    return Mrr.ProtoMrObject.encode(protoRoot).finish()
}
