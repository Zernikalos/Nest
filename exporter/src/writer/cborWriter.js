import {encode as cborEncode} from "cborg"

const buf2hex = (buffer) => { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
}

function writeTree(node) {
    const auxNode = {...node}
    const type = auxNode.type
    delete auxNode.type

    auxNode.children = node.children.map((child) => writeTree(child))

    return [type, auxNode]
}

export function cborWrite(node) {
    const root = writeTree(node)
    return cborEncode(root)
}

export function cborHexWrite(node) {
    const encoded = cborWrite(node)
    return buf2hex(encoded)
}
