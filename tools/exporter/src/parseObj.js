import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {write} from "./mrrWriter";
import {exportThreeObj} from "./exporters";

export const parseObj = (fileContent) => {
    // instantiate a loader
    const loader = new OBJLoader()

    const threeObj = loader.parse(fileContent)
    const parsed = exportThreeObj(threeObj);
    const mrr = write(parsed);
    return {threeObj, parsed, mrr};
};
