import { MrComponent } from "./MrComponent";
import { MrRenderingContext } from "./MrRenderingContext";

export class MrVertexArrayObject extends MrComponent {

    constructor(
        ctx: MrRenderingContext,
    ) {
        super(ctx);
    }

    public initialize() {
        const ctx = this.ctx;
        const gl = ctx.gl;

        this.data.vao = gl.createVertexArray();
        gl.bindVertexArray(this.data.vao);
    }

    public render() {
        const gl = this.ctx.gl;
        gl.bindVertexArray(this.data.vao);
    }
}

export namespace MrVertexArrayObject {
    export interface Data {
        vao?: WebGLVertexArrayObject;
    }
}
