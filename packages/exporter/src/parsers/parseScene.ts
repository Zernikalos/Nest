import {Color, Scene} from "three";
import {MrScene} from "../mrr/MrScene";
import {MrColor} from "../mrr/MrColor";

export function parseScene(obj: Scene): MrScene {
    const scene = new MrScene()

    const threeColor = obj.background as Color
    scene.clearColor = new MrColor(threeColor.r, threeColor.g, threeColor.b, 1.0)

    return scene
}
