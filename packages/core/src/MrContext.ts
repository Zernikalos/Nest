import {MrRenderingContext} from "@mrrobotto/components";

/**
 * OpenGL Context
 */
export class MrContext implements MrRenderingContext {

    private _nativeCtx: WebGL2RenderingContext;

    constructor(private _canvas: HTMLCanvasElement) {
        this._nativeCtx = this._canvas.getContext("webgl2") || new WebGL2RenderingContext();
    }

    /**
     * Width of the container
     */
    public get width(): number {
        return this._canvas.width;
    }

    /**
     * Height of the container
     */
    public get height(): number {
        return this._canvas.height;
    }

    /**
     * OpenGL context
     */
    public get gl(): WebGL2RenderingContext {
        return this._nativeCtx;
    }

}
