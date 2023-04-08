import {Object3D} from "three";
import {RawTexture} from "./RawTexture";

export class ZkoParseableObject {
    private threeObj: Object3D
    private assets: RawTexture[]

    constructor(obj: Object3D, assets: RawTexture[] = []) {
        this.threeObj = obj
        this.assets = assets
    }

    public get _threeObj(): Object3D {
        return this.threeObj
    }

    public get _assets(): RawTexture[] {
        return this.assets
    }

}
