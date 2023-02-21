import {Float} from "../../utils/Float";

export class MrQuaternion {
    w: number
    x: number
    y: number
    z: number

    constructor(w: number, x: number, y: number, z: number) {
        this.w = w

        this.x = x
        this.y = y
        this.z = z
    }

    encodeCBOR(encoder: any): boolean {
        return encoder.pushAny({
            w: new Float(this.w),
            x: new Float(this.x),
            y: new Float(this.y),
            z: new Float(this.z),
        })
    }

}
