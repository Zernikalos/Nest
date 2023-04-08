import {ZkoParseableObject} from "./ZkoParseableObject"
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {RawTexture} from "./RawTexture";
// import {SkeletonHelper} from "three"
//var helper = new SkeletonHelper( mesh.skeleton.bones[ 0 ] );

export async function gltfLoader(filePath: string): Promise<ZkoParseableObject> {
    const loader = new GLTFLoader()

    const gltf = await loader.loadAsync(filePath)

    // const parser = threeObj.parser
    // const json = parser.json
    // if (json.images.length > 0) {
    //     for (const img of json.images) {
    //         const bufferView = await parser.getDependency('bufferView', img.bufferView)
    //     }
    // }

    const textures = await loadRawTextures(gltf)

    return new ZkoParseableObject(gltf.scene, textures)
}

async function loadRawTextures(gltf: GLTF) {
    const rawTextures: RawTexture[] = []
    const parser = gltf.parser
    const images = parser?.json?.images

    if (!images) {
        return rawTextures
    }

    for (const img of images) {
        const bufferView = await parser.getDependency('bufferView', img.bufferView)
        const texture: RawTexture = new RawTexture()
        texture.name = img.name
        texture.data = bufferView
        texture.mimeType = img.mimeType

        rawTextures.push(texture)
    }

    return rawTextures
}
