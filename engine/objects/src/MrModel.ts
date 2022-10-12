import { MrMesh, MrShaderProgram } from "@mrrobotto/components";
import { MrObject } from "./MrObject";

export class MrModel extends MrObject {

    constructor(public readonly data: MrModel.Data) {
        super();
    }

}

export namespace MrModel {

    export interface Data {
        mesh: MrMesh;
        program: MrShaderProgram;
    }

}
