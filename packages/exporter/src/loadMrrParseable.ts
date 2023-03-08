import merge from "lodash/merge";
import {objLoader} from "./formats/objLoader";
import {gltfLoader} from "./formats/gltfLoader";
import {MrrParseableObject} from "./formats/MrrParseableObject";
import _ from "lodash";

export interface LoadOptions {
    filePath: string
    format?: 'obj' | 'gltf'
}

export const DEFAULT_LOAD_OPTIONS: Partial<LoadOptions> = {
    format: "obj",
}

export async function loadMrrParseable(options: LoadOptions): Promise<MrrParseableObject> {
    let result

    const mergedOptions: LoadOptions = merge({}, DEFAULT_LOAD_OPTIONS, options)
    const {filePath, format} = mergedOptions
    
    if (_.isNil(filePath)) {
        throw new Error("Filepath argument needs to be defined")
    }

    switch (format) {
        case "obj":
            result = await objLoader(filePath)
            break
        case "gltf":
            result = await gltfLoader(filePath)
            break
    }
    return result
}
