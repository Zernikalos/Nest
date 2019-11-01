import { MrRenderingContext } from "../ui/MrRenderingContext";
import { MrDataType } from "./constants";
import { MrComponent } from "./MrComponent";

export class MrBufferIndex extends MrComponent {

    constructor(
        ctx: MrRenderingContext,
        public readonly data: MrBufferIndex.Data,
    ) {
        super(ctx);
    }

    public initialize() {
        const gl = this.ctx.gl;
        gl.enableVertexAttribArray(this.data.index);
        gl.vertexAttribPointer(
            this.data.index,
            this.data.size,
            this.data.dataType,
            false,
            this.data.stride,
            this.data.pointer,
        );
    }
}

export namespace MrBufferIndex {
    export interface Data {
        index: number;
        dataType: MrDataType;
        size: number;
        stride: number;
        pointer: number;
    }
}
