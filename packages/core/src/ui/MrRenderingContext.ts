
export class MrRenderingContext {

    private _nativeCtx: WebGL2RenderingContext;

    constructor(private _canvas: HTMLCanvasElement) {
        this._nativeCtx = this._canvas.getContext("webgl2") || new WebGL2RenderingContext();
    }

    public get width(): number {
        return this._canvas.width;
    }

    public get height(): number {
        return this._canvas.height;
    }

    public get gl(): WebGL2RenderingContext {
        return this._nativeCtx;
    }

}
