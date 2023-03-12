import {Mrr} from "../../proto";

export class MrBuffer {
    targetBuffer: Mrr.BufferTargetType
    usage: Mrr.BufferUsageType
    count: number
    itemSize: number
    dataArray: Uint8Array

    constructor() {
        this.usage = Mrr.BufferUsageType.STATIC_DRAW
    }
}
