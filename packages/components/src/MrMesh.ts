import {MrRenderingContext} from "./MrRenderingContext";

import {MrDataType} from "./constants";
import {MrBuffer} from "./MrBuffer";
import {MrComponent} from "./MrComponent";
import {MrIndexedBuffer} from "./MrIndexedBuffer";
import {MrVertexArrayObject} from "./MrVertexArrayObject";

export class MrMesh extends MrComponent {

    public readonly data: MrMesh.Data;

    constructor(
        ctx: MrRenderingContext,
        data: {
            drawMode: MrMesh.DrawMode,
            numFaces: number,
            indexBufferData: {
                array: number[],
            },
            vertexBufferData: {
                array: number[],
                indices: MrIndexedBuffer.Key[],
            },
        }) {
        super(ctx);

        const vertexArrayObject = new MrVertexArrayObject(this.ctx);
        const indexBuffer = new MrBuffer(
            ctx,
            {
                target: MrBuffer.TargetType.ELEMENT_ARRAY_BUFFER,
                usage: MrBuffer.UsageType.STATIC_DRAW,
                dataType: MrDataType.UNSIGNED_SHORT,
                dataArray: new Uint16Array(data.indexBufferData.array),
            });

        const vertexBuffer = new MrIndexedBuffer(
            ctx,
            {
                target: MrBuffer.TargetType.ARRAY_BUFFER,
                usage: MrBuffer.UsageType.STATIC_DRAW,
                dataType: MrDataType.FLOAT,
                dataArray: new Float32Array(data.vertexBufferData.array),
                keys: data.vertexBufferData.indices,
            });

        this.data = {
            drawMode: data.drawMode,
            numFaces: data.numFaces,
            vertexArrayObject,
            indexBuffer,
            vertexBuffer,
        };
    }

    public initialize() {
        this.data.vertexArrayObject.initialize();

        this.data.indexBuffer.initialize();
        this.data.vertexBuffer.initialize();
    }

    public render() {
        const gl = this.ctx.gl;
        this.data.vertexArrayObject.render();
        let numIndices = 0;
        switch (this.data.drawMode) {
            case MrMesh.DrawMode.TRIANGLES:
                numIndices = 3 * this.data.numFaces;
                break;
            case MrMesh.DrawMode.LINES:
                numIndices = 1 * this.data.numFaces;
                break;
        }
        gl.drawElements(this.data.drawMode, numIndices, this.data.indexBuffer.data.dataType, 0);
    }
}

export namespace MrMesh {

    export interface Data {
        drawMode: MrMesh.DrawMode;
        numFaces: number;
        vertexArrayObject: MrVertexArrayObject;
        indexBuffer: MrBuffer;
        vertexBuffer: MrIndexedBuffer;
    }

    export enum DrawMode {
        TRIANGLES = WebGL2RenderingContext.TRIANGLES,
        LINES = WebGL2RenderingContext.LINES,
    }
}
