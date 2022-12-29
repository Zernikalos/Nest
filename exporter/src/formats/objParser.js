import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {parseObject} from "../parsers"
import {postProcess} from "../post"

export function objParser(fileContent) {
    // instantiate a loader
    const loader = new OBJLoader()

    const threeObj = loader.parse(fileContent)
    let mrrObj = parseObject(threeObj)
    mrrObj = postProcess(mrrObj)
    return mrrObj
}
