import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import {parseObject} from "../parsers"
import {postProcess} from "../post"

export async function objParser(filePath: string) {
    // instantiate a loader
    const loader = new OBJLoader()

    const threeObj = await loader.loadAsync(filePath)
    let mrrObj = parseObject(threeObj)
    mrrObj = postProcess(mrrObj)
    return mrrObj
}
