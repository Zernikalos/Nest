import {MrrParseableObject} from "./MrrParseableObject"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export async function gltfLoader(filePath: string): Promise<MrrParseableObject> {
    const loader = new GLTFLoader()

    const threeObj = await loader.loadAsync(filePath)
    return new MrrParseableObject(threeObj.scene)
}
