import { MrRenderingContext } from "../ui/MrRenderingContext";
import { MrDataType } from "./constants";
import { MrBuffer } from "./MrBuffer";
import { MrBufferIndex } from "./MrBufferIndex";
import { MrComponent } from "./MrComponent";
import { MrVertexArrayObject } from "./MrVertexArrayObject";

export class MrMesh extends MrComponent {

    public readonly data: MrMesh.Data;

    constructor(
        ctx: MrRenderingContext,
        data: {
            drawMode: MrMesh.DrawMode,
            numFaces: number,
            indexBufferDataArray: number[],
            vertexBufferDataArray: number[],
            bufferIndices: MrBufferIndex.Data[],
        }) {
        super(ctx);

        const vertexArrayObject = new MrVertexArrayObject(this.ctx);
        const indexBuffer = new MrBuffer(
            ctx,
            {
                target: MrBuffer.TargetType.ELEMENT_ARRAY_BUFFER,
                usage: MrBuffer.UsageType.STATIC_DRAW,
                dataType: MrDataType.UNSIGNED_SHORT,
                dataArray: new Uint16Array(data.indexBufferDataArray),
            });

        const vertexBuffer = new MrBuffer(
            ctx,
            {
                target: MrBuffer.TargetType.ARRAY_BUFFER,
                usage: MrBuffer.UsageType.STATIC_DRAW,
                dataType: MrDataType.FLOAT,
                dataArray: new Float32Array(data.vertexBufferDataArray),
            });
        const bufferIndices: MrBufferIndex[] = [];
        data.bufferIndices.forEach((bufferIndexData) => {
            bufferIndices.push(new MrBufferIndex(this.ctx, bufferIndexData));
        });

        this.data = {
            drawMode: data.drawMode,
            numFaces: data.numFaces,
            vertexArrayObject,
            indexBuffer,
            vertexBuffer,
            bufferIndices,
        };
    }

    public initialize() {
        this.data.vertexArrayObject.initialize();

        this.data.indexBuffer.initialize();
        this.data.vertexBuffer.initialize();

        this.data.bufferIndices.forEach((index) => {
            index.initialize();
        });
    }

    public render() {
        const gl = this.ctx.gl;
        this.data.vertexArrayObject.render();
        gl.drawElements(this.data.drawMode, this.data.numFaces, this.data.indexBuffer.data.dataType, 0);
    }
}

export namespace MrMesh {

    export interface Data {
        drawMode: MrMesh.DrawMode;
        numFaces: number;
        vertexArrayObject: MrVertexArrayObject;
        indexBuffer: MrBuffer;
        vertexBuffer: MrBuffer;
        bufferIndices: MrBufferIndex[];
    }

    export enum DrawMode {
        TRIANGLES = WebGL2RenderingContext.TRIANGLES,
        LINES = WebGL2RenderingContext.LINES,
    }
}
