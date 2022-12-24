import {MrAttributeKey} from "./MrAttributeKey";
import {MrShape} from "./MrShape";

export class MrMesh {
    attributes: Map<string, MrAttributeKey> = new Map()
    shape: MrShape
}
