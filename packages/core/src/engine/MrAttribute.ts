import { MrRenderingContext } from "../ui/MrRenderingContext";
import {MrComponent} from "./MrComponent";
import { MrProgram } from "./MrProgram";

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
        type: MrAttribute.Type;
        attrName: string;
    }

    export const enum Type {
        VERTICES,
        NORMALS,
        COLOR,
        MATERIAL_INDEX,
        TEXTURE,
        WEIGHT,
        BONE_INDICES,
    }
}
