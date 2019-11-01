import { MrRenderingContext } from "../ui/MrRenderingContext";
import { MrDataType } from "./constants";
import { MrComponent } from "./MrComponent";

export class MrBuffer extends MrComponent {

    constructor(
        ctx: MrRenderingContext,
        public readonly data: MrBuffer.Data,
    ) {
        super(ctx);
    }

    public initialize() {
        const gl = this.ctx.gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error("Unable to create buffer");
        }
        this.data.buffer = buffer;
        gl.bindBuffer(this.data.target, this.data.buffer);
        gl.bufferData(this.data.target, this.data.dataArray, this.data.usage);
    }
}

export namespace MrBuffer {

    export interface Data {
        buffer?: WebGLBuffer;
        target: MrBuffer.TargetType;
        usage: MrBuffer.UsageType;
        dataType: MrDataType;
        dataArray: ArrayBuffer;
    }

    export enum TargetType {
        /**
         * Target type for VBO
         */
        ARRAY_BUFFER = WebGL2RenderingContext.ARRAY_BUFFER,
        /**
         * Target type for IBO
         */
        ELEMENT_ARRAY_BUFFER = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER,
    }

    export enum UsageType {
        STATIC_DRAW = WebGL2RenderingContext.STATIC_DRAW,
    }
}
