import {parseObject} from "./parsers";
import {postProcess} from "./post";
import {MrrParseableObject} from "./formats/MrrParseableObject";
import {MrObject} from "./mrr/MrObject";
import _ from "lodash";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ParseOptions {

}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {

}

export function parseToMrr(parseableObject: MrrParseableObject, options: ParseOptions): MrObject {

    // @ts-ignore
    const mergedOptions = _.merge({}, DEFAULT_PARSE_OPTIONS, options)

    let mrrObj = parseObject(parseableObject._threeObj)
    mrrObj = postProcess(mrrObj)
    return mrrObj
}
