
import axios from "axios";
import {Mrr} from "@mrrobotto/mrr";

export function load(reader: Uint8Array) {
    return Mrr.Node.decode(reader);
}

export async function loadFile(filename: string) {
    let result;
    try {
        result = await axios.get(filename, {responseType: 'arraybuffer'});
    } catch (e) {
        throw new Error(`Unable to find file ${filename}, Error: ${e}`)
    }

    return load(new Uint8Array(result.data));
}
