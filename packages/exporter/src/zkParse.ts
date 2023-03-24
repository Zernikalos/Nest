import {parseObject} from "./parsers";
import {postProcess} from "./post";
import {ZkoParseableObject} from "./formats/ZkoParseableObject";
import {ZObject} from "./zernikalos/ZObject";
import _ from "lodash";
import {IdGenerator} from "./utils/IdGenerator";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ParseOptions {

}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {

}

export function zkParse(parseableObject: ZkoParseableObject, options: ParseOptions): ZObject {

    // @ts-ignore
    const mergedOptions = _.merge({}, DEFAULT_PARSE_OPTIONS, options)

    IdGenerator.parseBegin()

    let zkObj = parseObject(parseableObject._threeObj)
    zkObj = postProcess(zkObj)

    IdGenerator.reset()
    return zkObj
}
