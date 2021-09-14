import {MrRenderingContext} from "../MrRenderingContext";

import {MrComponent} from "../MrComponent";

/**
 * This represents program, this means the bindable element
 * ,this works alongsider {{MrShader}} and {{MrShaderProgram}}
 */
export class MrProgram extends MrComponent {

    public data: MrProgram.Data;

    constructor(
        ctx: MrRenderingContext,
    ) {
        super(ctx);
        this.data = {
            program: -1,
        };
    }

    public render() {
        const gl = this.ctx.gl;
        gl.useProgram(this.data.program);
    }

    public initialize() {
        const gl = this.ctx.gl;

        const program = gl.createProgram();
        if (!program) {
            throw new Error("Unable to create program");
        }

        this.data.program = program;
    }

    public link() {
        this.ctx.gl.linkProgram(this.data.program);
    }

}

export namespace MrProgram {
    export interface Data {
        /**
         * Internal program
         */
        program: WebGLProgram;
    }
}
