import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export function gltfParser(filePath) {
    const loader = new GLTFLoader()

    loader.loadAsync(filePath)
}
