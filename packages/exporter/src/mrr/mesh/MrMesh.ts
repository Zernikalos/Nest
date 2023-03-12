import {MrAttributeKey} from "./MrAttributeKey";
import {MrIndexBuffer} from "./MrIndexBuffer";
import {MrVertexBuffer} from "./MrVertexBuffer";

export class MrMesh  {
    indices: MrIndexBuffer = new MrIndexBuffer()

    private _attributeKeys: Map<string, MrAttributeKey> = new Map()
    private _vertices: Map<string, MrVertexBuffer> = new Map()

    public get attributeKeys(): {[key: string]: MrAttributeKey} {
        return Object.fromEntries(this._attributeKeys)
    }

    public get vertices(): {[key: string]: MrVertexBuffer} {
        return Object.fromEntries(this._vertices)
    }

    public get attributeKeysMap() {
        return this._attributeKeys
    }

    public get verticesMap() {
        return this._vertices
    }

    public setAttributeKey(key: string, attr: MrAttributeKey) {
        this._attributeKeys.set(key, attr)
    }

    public setAttributeKeys(keys: Map<string, MrAttributeKey>) {
        for (const [key, attr] of keys.entries()) {
            this.setAttributeKey(key, attr)
        }
    }

    public setVertexBuffer(key: string, buffer: MrVertexBuffer) {
        this._vertices.set(key, buffer)
    }
}
