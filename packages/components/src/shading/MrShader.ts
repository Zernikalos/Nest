import {MrRenderingContext} from "../MrRenderingContext";

import {MrComponent} from "../MrComponent";
import {MrProgram} from "./MrProgram";

/**
 * Represents a Shader, this means, the compiled source
 */
export class MrShader extends MrComponent {

    constructor(ctx: MrRenderingContext, public readonly data: MrShader.Data) {
        super(ctx);
    }

    public initialize(compData: MrProgram.Data): void {
        const gl = this.ctx.gl;
        const shader = gl.createShader(this.data.type);
        if (!shader) {
            throw new Error("Error creating shader");
        }
        gl.shaderSource(shader, this.data.source);
        gl.compileShader(shader);

        const compileStatus = gl.getShaderInfoLog(shader);
        const compileError = gl.getError();
        if (compileStatus || compileError) {
            gl.deleteShader(shader);
            throw new Error("Error compiling shader");
        }
        this.data.shader = shader;

        gl.attachShader(compData.program, this.data.shader);
    }

}

export namespace MrShader {

    export interface Data {
        /**
         * Type of shader, VERTEX or FRAGMENT
         */
        type: MrShader.Type;

        /**
         * Source code of this shader
         */
        source: string;

        /**
         * Internal shader representation
         */
        shader?: WebGLShader;
    }

    export enum Type {
        VERTEX_SHADER = WebGL2RenderingContext.VERTEX_SHADER,
        FRAGMENT_SHADER = WebGL2RenderingContext.FRAGMENT_SHADER,
    }
}
