import {ZkoParseableObject} from "./ZkoParseableObject"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export async function gltfLoader(filePath: string): Promise<ZkoParseableObject> {
    const loader = new GLTFLoader()

    const threeObj = await loader.loadAsync(filePath)
    return new ZkoParseableObject(threeObj.scene)
}
