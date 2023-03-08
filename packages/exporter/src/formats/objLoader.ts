import {MrrParseableObject} from "./MrrParseableObject";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

export async function objLoader(filePath: string): Promise<MrrParseableObject> {
    const loader = new OBJLoader()

    const threeObj = await loader.loadAsync(filePath)
    return new MrrParseableObject(threeObj)
}
