import objectHash from "object-hash"
import {ZTransform} from "./ZTransform";
import {IdGenerator} from "../utils/IdGenerator";

export type ZObjectType = "Object" | "Model" | "Group" | "Scene"

export class ZObject {
    type: ZObjectType = "Object"
    transform: ZTransform
    children: ZObject[] = []

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

    public addChild(child: ZObject) {
        this.children.push(child)
    }
}
