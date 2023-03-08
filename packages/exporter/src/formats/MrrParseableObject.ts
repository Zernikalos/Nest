import {Object3D} from "three";

export class MrrParseableObject {
    private threeObj: Object3D

    constructor(obj: Object3D) {
        this.threeObj = obj
    }

    public get _threeObj(): Object3D {
        return this.threeObj
    }

}
