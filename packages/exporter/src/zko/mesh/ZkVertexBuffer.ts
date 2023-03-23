import {ZkBuffer} from "./ZkBuffer";
import {Zko} from "../../proto";

export class ZkVertexBuffer extends ZkBuffer {
    constructor() {
        super()
        this.targetBuffer = Zko.BufferTargetType.ARRAY_BUFFER
    }
}
