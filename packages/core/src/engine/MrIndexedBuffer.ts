import { MrRenderingContext } from "../ui/MrRenderingContext";
import { MrDataType } from "./constants";
import { MrBuffer } from "./MrBuffer";

export class MrIndexedBuffer extends MrBuffer {

    constructor(
        ctx: MrRenderingContext,
        public readonly data: MrIndexedBuffer.Data,
    ) {
        super(ctx, data);
    }

    public initialize() {
        super.initialize();
        const gl = this.ctx.gl;
        for (const key of this.data.keys) {
            gl.enableVertexAttribArray(key.index);
            gl.vertexAttribPointer(
                key.index,
                key.size,
                key.dataType,
                false,
                key.stride,
                key.pointer,
            );
        }
;
    }
}

export namespace MrIndexedBuffer {
    export interface Data extends MrBuffer.Data {
        keys: MrIndexedBuffer.Key[];
    }

    export interface Key {
        index: number;
        dataType: MrDataType;
        size: number;
        stride: number;
        pointer: number;
    }
}
