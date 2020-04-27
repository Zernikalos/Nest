import {MrContext} from "./MrContext";

export class MrRobotto {

    private _ctx?: MrContext;

    get ctx() {
        return this._ctx;
    }

    public initialize(canvas: HTMLCanvasElement) {
        this._ctx = new MrContext(canvas);

        /* function get_projection(angle: number, a: number, zMin: number, zMax: number) {
          const ang = Math.tan((angle * .5) * Math.PI / 180);
          return [
             0.5 / ang, 0 , 0, 0,
             0, 0.5 * a / ang, 0, 0,
             0, 0, -(zMax + zMin) / (zMax - zMin), -1,
             0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0,
          ];
       } */

        this.resizeCanvas(this._ctx.gl.canvas as HTMLCanvasElement);

        if (!this._ctx.gl) {
            throw new Error("Unable to start a GL context");
        }
    }

    private resizeCanvas(canvas: HTMLCanvasElement, multiplier?: number) {
        multiplier = multiplier || 1;
        const width = canvas.clientWidth * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }
}
