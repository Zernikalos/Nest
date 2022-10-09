import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {writeMrr} from "../mrrWriter";
import {exportThreeObj} from "../threeExporter";

export function objParser(fileContent) {
    // instantiate a loader
    const loader = new OBJLoader()

    const threeObj = loader.parse(fileContent);
    const parsed = exportThreeObj(threeObj);
    const mrr = writeMrr(parsed);
    return {threeObj, parsed, mrr};
}
