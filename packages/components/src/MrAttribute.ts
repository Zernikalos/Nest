import {MrComponent} from "./MrComponent";
import { MrProgram } from "./MrProgram";
import { MrRenderingContext } from "./MrRenderingContext";

export class MrAttribute extends MrComponent {

    constructor(ctx: MrRenderingContext, public readonly data: MrAttribute.Data) {
        super(ctx);
    }

    public initialize(compData: MrProgram.Data) {
        const gl = this.ctx.gl;
        gl.bindAttribLocation(compData.program, this.data.index, this.data.attrName);
    }

}

export namespace MrAttribute {

    export interface Data {
        index: number;
        attrName: string;
    }
}
