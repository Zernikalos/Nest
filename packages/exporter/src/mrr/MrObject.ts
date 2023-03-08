import {MrTransform} from "./MrTransform";

export type MrObjectType = "Object" | "Model" | "Group" | "Scene"

export class MrObject {
    type: MrObjectType = "Object"
    name = ""
    transform: MrTransform
    children: MrObject[] = []

    public addChild(child: MrObject) {
        this.children.push(child)
    }
}
