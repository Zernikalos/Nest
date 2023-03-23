import {Color, Scene} from "three";
import {ZkScene} from "../zko/ZkScene";
import {ZkColor} from "../zko/ZkColor";

export function parseScene(obj: Scene): ZkScene {
    const scene = new ZkScene()

    const threeColor = obj.background as Color
    scene.clearColor = new ZkColor(threeColor.r, threeColor.g, threeColor.b, 1.0)

    return scene
}
