import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {parseObject} from "../parsers";
import {postProcess} from "../post";

export async function gltfParser(filePath: string) {
    const loader = new GLTFLoader()

    const threeObj = await loader.loadAsync(filePath)
    let mrrObj = parseObject(threeObj.scene)
    mrrObj = postProcess(mrrObj)
    return mrrObj
}
