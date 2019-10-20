import { MrRenderingContext } from "./../ui/MrRenderingContext";
import { MrComponent, MrComponentData, MrComponentView } from "./MrComponent";
import { MrAttributeType } from "./MrShaderProgram";

export class MrMesh extends MrComponent {

    protected data: MrMeshData;
    protected view: MrMeshView;

    constructor(
        name: string,
        ctx: MrRenderingContext,
        drawInfo: MrDrawInfo,
        keys: MrBufferKey[],
        indexBufferSource: number[],
        vertexBufferSource: number[]) {
        super(name, ctx);
        this.data = new MrMeshData(drawInfo, keys, indexBufferSource, vertexBufferSource);
        this.view = new MrMeshView(ctx, this.data);
    }

    public initialize() {
        this.view.initialize();
    }

    public bind() {
        this.view.bind();
    }

    public draw() {
        this.view.draw();
    }
}

class MrMeshData extends MrComponentData {

    public readonly indexBuffer: MrBuffer;
    public readonly vertexBuffer: MrBuffer;
    public vao: WebGLVertexArrayObject = -1;

    constructor(
        public readonly drawInfo: MrDrawInfo,
        public readonly keys: MrBufferKey[],
        indexBufferSource: number[],
        vertexBufferSource: number[]) {
        super();
        this.indexBuffer = new MrBuffer(
            MrBufferTargetType.ELEMENT_ARRAY_BUFFER,
            MrBufferUsageType.STATIC_DRAW,
            new Uint8Array(indexBufferSource));
        this.vertexBuffer = new MrBuffer(
            MrBufferTargetType.ARRAY_BUFFER,
            MrBufferUsageType.STATIC_DRAW,
            new Float32Array(vertexBufferSource));
    }

}

class MrMeshView extends MrComponentView {

    public initialize() {
        const data = this.data as MrMeshData;
        const gl = this.ctx.gl;
        this.initializeBuffer(data.vertexBuffer);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        if (!vao) {
            throw new Error("Unable to create Mesh");
        }
        data.keys.forEach((key) => this.intitializeBufferKey(key));
        data.vao = vao;
    }

    public bind() {
        const data = this.data as MrMeshData;
        const gl = this.ctx.gl;
        gl.bindVertexArray(data.vao);
    }

    public draw() {
        const data = this.data as MrMeshData;
        const gl = this.ctx.gl;
        gl.drawArrays(data.drawInfo.drawMode, 0, data.drawInfo.count);
    }

    private initializeBuffer(mrBuffer: MrBuffer) {
        const gl = this.ctx.gl;
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error("Unable to create buffer");
        }
        gl.bindBuffer(mrBuffer.target, buffer);
        gl.bufferData(mrBuffer.target, mrBuffer.data, mrBuffer.usage);
        mrBuffer.buffer = buffer;
    }

    private intitializeBufferKey(mrBufferKey: MrBufferKey) {
        const gl = this.ctx.gl;
        gl.enableVertexAttribArray(mrBufferKey.attributeType);
        gl.vertexAttribPointer(
            mrBufferKey.attributeType,
            mrBufferKey.size,
            mrBufferKey.dataType,
            false,
            mrBufferKey.stride,
            mrBufferKey.pointer);
    }

}

class MrDrawInfo {

    constructor(public readonly drawMode: MrDrawMode, public readonly count: number) {

    }
}

export enum MrDrawMode {
    TRIANGLES = WebGL2RenderingContext.TRIANGLES,
}

enum MrBufferTargetType {
    /**
     * Target type for VBO
     */
    ARRAY_BUFFER = WebGL2RenderingContext.ARRAY_BUFFER,
    /**
     * Target type for IBO
     */
    ELEMENT_ARRAY_BUFFER = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER,
}

enum MrBufferUsageType {
    STATIC_DRAW = WebGL2RenderingContext.STATIC_DRAW,
}

class MrBuffer {

    public buffer: WebGLBuffer = -1;

    constructor(
        public readonly target: MrBufferTargetType,
        public readonly usage: MrBufferUsageType,
        public readonly data: ArrayBuffer) {
    }

}

export enum MrDataType {
    UNSIGNED_SHORT = WebGL2RenderingContext.UNSIGNED_SHORT,
    FLOAT = WebGL2RenderingContext.FLOAT,
}

class MrBufferKey {

    constructor(
        public readonly attributeType: MrAttributeType,
        public readonly dataType: MrDataType,
        public readonly size: number,
        public readonly stride: number,
        public readonly pointer: number,
    ) {}

}
