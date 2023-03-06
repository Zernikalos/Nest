import {MrBuffer} from "./MrBuffer";
import {Mrr} from "../../proto";

export class MrVertexBuffer extends MrBuffer {
    constructor() {
        super()
        this.targetBuffer = Mrr.BufferTargetType.ARRAY_BUFFER
    }
}
