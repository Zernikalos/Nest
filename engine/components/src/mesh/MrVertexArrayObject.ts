import {MrComponent} from "../MrComponent";
import {MrRenderingContext} from "../MrRenderingContext";

/**
 * Vertex array object representation
 */
export class MrVertexArrayObject extends MrComponent {

    public readonly data: MrVertexArrayObject.Data;

    constructor(
        ctx: MrRenderingContext,
    ) {
        super(ctx);
        this.data = {
            vao: null
        }
    }

    public initialize(): void {
        const ctx = this.ctx;
        const gl = ctx.gl;

        this.data.vao = gl.createVertexArray();
        if (this.data.vao === null) {
            throw new Error("Unable to create vertex array");
        }
        gl.bindVertexArray(this.data.vao);
    }

    public render(): void {
        const gl = this.ctx.gl;
        gl.bindVertexArray(this.data.vao);
    }
}

export namespace MrVertexArrayObject {
    export interface Data {
        /**
         * Internal use, VAO associated
         */
        vao: WebGLVertexArrayObject | null;
    }
}
