import objectHash from "object-hash"
import {ZkTransform} from "./ZkTransform";
import {IdGenerator} from "../utils/IdGenerator";

export type ZkObjectType = "Object" | "Model" | "Group" | "Scene"

export class ZkObject {
    type: ZkObjectType = "Object"
    transform: ZkTransform
    children: ZkObject[] = []

    private _id: string
    private _name: string

    public get id(): string {
        if (!this._id) {
            this._id = objectHash(this)
        }
        return this._id
    }

    public get name(): string {
        if (!this._name) {
            const id = IdGenerator.add(this.type)
            this._name = `${this.type}_${id}`
        }
        return this._name
    }

    public set name(value: string) {
        if (!value) {
            return
        }
        IdGenerator.pop(this.type)
        this._name = value
    }

    public addChild(child: ZkObject) {
        this.children.push(child)
    }
}
