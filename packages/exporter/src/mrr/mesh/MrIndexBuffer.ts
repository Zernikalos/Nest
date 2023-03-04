import {MrBuffer} from "./MrBuffer";
import {Mrr} from "../../proto";

export class MrIndexBuffer extends MrBuffer {
    constructor() {
        super()
        this.targetBuffer = Mrr.BufferTargetType.ELEMENT_ARRAY_BUFFER
    }
}
