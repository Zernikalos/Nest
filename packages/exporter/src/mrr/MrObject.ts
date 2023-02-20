import {MrTransform} from "./MrTransform";

export type MrObjectType = "Object" | "Model" | "Group"

export class MrObject {
    type: MrObjectType = "Object"
    name = ""
    transform: MrTransform
    children: MrObject[] = []
}
