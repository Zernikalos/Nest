import { MrVector4 } from "@mrrobotto/linalg";
import {MrComponent} from "./MrComponent";
import { MrRenderingContext } from "./MrRenderingContext";

export class MrScene extends MrComponent {

    constructor(
        ctx: MrRenderingContext,
        public readonly data: MrScene.Data,
    ) {
        super(ctx);
    }

    public initialize() {
        this.ctx.gl.viewport(
            this.data.viewPort.x,
            this.data.viewPort.y,
            this.data.viewPort.width,
            this.data.viewPort.height,
            );
    }

    public render() {
        this.ctx.gl.clearColor(
            this.data.clearColor.x,
            this.data.clearColor.y,
            this.data.clearColor.z,
            this.data.clearColor.w,
        );
        this.ctx.gl.clear(this.data.clearMask);
    }

}

export namespace MrScene {

    export interface Data {
        viewPort: {
            x: number,
            y: number,
            width: number,
            height: number,
        };
        clearColor: MrVector4;
        clearMask: number;
    }

}
