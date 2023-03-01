import {MrObject, MrObjectType} from "../mrr/MrObject"
import {CborEncoder} from "../utils/CborEncoder";

interface CborMrObject {
    [key: string]: any
    children: [MrObjectType, CborMrObject][]
}

function writeTree(node: MrObject): [MrObjectType, CborMrObject] {
    const auxNode: CborMrObject = {...node, children: []}
    const type = auxNode.type
    delete auxNode.type

    auxNode.children = node.children.map((child) => writeTree(child))

    return [type, auxNode]
}

export function cborWrite(node: MrObject) {
    const root = writeTree(node)
    const encoder = new CborEncoder()
    return encoder.encode(root)
}
