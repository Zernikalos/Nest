import * as cbor from "cbor-web";

function writeTree(node) {
    const auxNode = {...node}
    const type = auxNode.type
    delete auxNode.type

    auxNode.children = node.children.map((child) => writeTree(child))

    return [type, auxNode]
}

export function cborWrite(node) {
    const root = writeTree(node);
    return cbor.encode(root);
}
