import { MrDataType } from "./constants";
import { MrComponent } from "./MrComponent";
import { MrProgram } from "./MrProgram";
import { MrRenderingContext } from "./MrRenderingContext";

export class MrUniform extends MrComponent {
    constructor(
        ctx: MrRenderingContext,
        public readonly data: MrUniform.Data,
    ) {
        super(ctx);
    }

    public initialize(compData: MrProgram.Data) {
        const gl = this.ctx.gl;
        const uniformLocation = gl.getUniformLocation(compData.program, this.data.uniformName);
        if (!uniformLocation) {
            return;
        }
        this.data.uniformLocation = uniformLocation;
    }

    public render() {
        const gl = this.ctx.gl;
        if (!this.data.uniformLocation || !this.data.value) {
            return;
        }
        gl.uniform4fv(this.data.uniformLocation, this.data.value);
    }

}

export namespace MrUniform {
    export interface Data {
        uniformName: string;
        dataType: MrDataType;
        uniformLocation?: WebGLUniformLocation;
        value?: number[];
    }
}
