// @ts-ignore
import * as cbor from "cbor-web"
import {Float} from "../../utils/Float";

export class MrVector3 {
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    encodeCBOR(encoder: any): boolean {
        return encoder.pushAny({
            x: new Float(this.x),
            y: new Float(this.y),
            z: new Float(this.z),
        })
    }

}
