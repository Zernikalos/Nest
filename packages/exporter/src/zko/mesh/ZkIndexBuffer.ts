import {ZkBuffer} from "./ZkBuffer";
import {Zko} from "../../proto";

export class ZkIndexBuffer extends ZkBuffer {
    constructor() {
        super()
        this.targetBuffer = Zko.BufferTargetType.ELEMENT_ARRAY_BUFFER
    }
}
