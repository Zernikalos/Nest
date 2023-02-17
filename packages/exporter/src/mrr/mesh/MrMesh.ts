import {MrAttributeKey} from "./MrAttributeKey";
import {MrIndexBuffer} from "./MrIndexBuffer";
import {MrVertexBuffer} from "./MrVertexBuffer";

export class MrMesh {
    attributeKeys: Map<string, MrAttributeKey> = new Map()
    indices: MrIndexBuffer = new MrIndexBuffer()
    vertices: Map<string, MrVertexBuffer> = new Map()
}
