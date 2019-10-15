
export class MrRobotto {

    private _context!: WebGLRenderingContext;

    public initialize(canvas: HTMLCanvasElement) {
        this.setContext(canvas);
    }

    public start() {
    }

    private setContext(canvas: HTMLCanvasElement) {
        const context = canvas.getContext("webgl2");
        if (context) {
            this._context = context;
        }
    }
}