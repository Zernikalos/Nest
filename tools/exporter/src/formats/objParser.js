import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {cborWrite} from "../writer/cborWriter"
import {parseObject} from "../parsers"
import {postProcess} from "../post";

const buf2hex = (buffer) => { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
}

export function objParser(fileContent) {
    // instantiate a loader
    const loader = new OBJLoader()

    const threeObj = loader.parse(fileContent)
    let mrrObj = parseObject(threeObj)
    mrrObj = postProcess(mrrObj)
    const mrr = cborWrite(mrrObj)
    return {threeObj, mrrObj, mrr, hex: buf2hex(mrr) }
}
