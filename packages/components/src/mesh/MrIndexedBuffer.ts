import {MrRenderingContext} from "../MrRenderingContext";

import {MrBuffer} from "./MrBuffer";
import {MrDataType} from "../MrConstants";

/**
 * Buffer class with indice keys
 */
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
    }
}

export namespace MrIndexedBuffer {
    export interface Data extends MrBuffer.Data {
        /**
         * Keys of this buffer
         */
        keys: MrIndexedBuffer.Key[];
    }

    export interface Key {
        /**
         * Index of the data to be used
         */
        index: number;

        /**
         * Native data type
         */
        dataType: MrDataType;

        /**
         * Number of components of the buffer attribute
         */
        size: number;

        /**
         * Byte offset between values
         */
        stride: number;

        /**
         * Offset of the first element related to the index
         */
        pointer: number;
    }
}
