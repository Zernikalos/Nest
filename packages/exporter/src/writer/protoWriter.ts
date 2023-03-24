import {ZObject} from "../zernikalos/ZObject"
import {Zko} from "../proto"

async function writeTree(obj: ZObject): Promise<Zko.ProtoZkObject> {
    const auxNode: Zko.ProtoZkObject = await promisedConverToProto(obj)

    auxNode.children = await Promise.all(obj.children.map(async (child) => await writeTree(child)))

    return auxNode
}

function convertToProto(obj: ZObject) {
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

function promisedConverToProto(obj: ZObject): Promise<Zko.ProtoZkObject> {
    return new Promise(resolve => {
        setTimeout(() =>{
            resolve(convertToProto(obj))
        })
    })
}

export async function protoTree(root: ZObject): Promise<Zko.ProtoZkObject> {
    return await writeTree(root)
}

export async function protoWrite(root: ZObject): Promise<Uint8Array> {
    const protoRoot = await writeTree(root)

    return Zko.ProtoZkObject.encode(protoRoot).finish()
}
