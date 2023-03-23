import {ZkObject} from "../zko/ZkObject"
import {Zko} from "../proto"

async function writeTree(obj: ZkObject): Promise<Zko.ProtoZkObject> {
    const auxNode: Zko.ProtoZkObject = await promisedConverToProto(obj)

    auxNode.children = await Promise.all(obj.children.map(async (child) => await writeTree(child)))

    return auxNode
}

function convertToProto(obj: ZkObject) {
    // TODO: The use of fromObject affects a lot to the performance
    let auxNode: Zko.ProtoZkObject
    switch (obj.type) {
        case "Group":
        case "Object":
            auxNode = new Zko.ProtoZkObject({
                type: "Group",
                group: Zko.ZkGroup.fromObject(obj)
            })
            break
        case "Model":
            auxNode = new Zko.ProtoZkObject({
                type: "Model",
                model: Zko.ZkModel.fromObject(obj)
            })
            break
    }
    return auxNode
}

function promisedConverToProto(obj: ZkObject): Promise<Zko.ProtoZkObject> {
    return new Promise(resolve => {
        setTimeout(() =>{
            resolve(convertToProto(obj))
        })
    })
}

export async function protoTree(root: ZkObject): Promise<Zko.ProtoZkObject> {
    return await writeTree(root)
}

export async function protoWrite(root: ZkObject): Promise<Uint8Array> {
    const protoRoot = await writeTree(root)

    return Zko.ProtoZkObject.encode(protoRoot).finish()
}
