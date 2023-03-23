import {ZkAttributeKey} from "./ZkAttributeKey";
import {ZkIndexBuffer} from "./ZkIndexBuffer";
import {ZkVertexBuffer} from "./ZkVertexBuffer";

export class ZkMesh {
    indices: ZkIndexBuffer = new ZkIndexBuffer()

    private _attributeKeys: Map<string, ZkAttributeKey> = new Map()
    private _vertices: Map<string, ZkVertexBuffer> = new Map()

    public get attributeKeys(): {[key: string]: ZkAttributeKey} {
        return Object.fromEntries(this._attributeKeys)
    }

    public get vertices(): {[key: string]: ZkVertexBuffer} {
        return Object.fromEntries(this._vertices)
    }

    public get attributeKeysMap() {
        return this._attributeKeys
    }

    public get verticesMap() {
        return this._vertices
    }

    public setAttributeKey(key: string, attr: ZkAttributeKey) {
        this._attributeKeys.set(key, attr)
    }

    public setAttributeKeys(keys: Map<string, ZkAttributeKey>) {
        for (const [key, attr] of keys.entries()) {
            this.setAttributeKey(key, attr)
        }
    }

    public setVertexBuffer(key: string, buffer: ZkVertexBuffer) {
        this._vertices.set(key, buffer)
    }
}
