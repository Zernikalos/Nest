import {MrAttributeKey} from "./MrAttributeKey";
import {MrIndexBuffer} from "./MrIndexBuffer";
import {MrVertexBuffer} from "./MrVertexBuffer";

export class MrMesh {
    attributeKeys: {[key: string]: MrAttributeKey} = {}
    indices: MrIndexBuffer = new MrIndexBuffer()
    vertices: {[key: string]: MrVertexBuffer} = {}

    get attributeKeysAsMap(): Map<string, MrAttributeKey> {
        return new Map<string, MrAttributeKey>(Object.entries(this.attributeKeys))
    }
}
