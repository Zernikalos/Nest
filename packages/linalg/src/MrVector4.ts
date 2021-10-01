/**
 * Vector of 4 components
 */
import {MrVector3} from "./MrVector3";

export class MrVector4 {
    public w: number;
    public x: number;
    public y: number;
    public z: number;

    private _values: number[];

    constructor(w = 0.0, x = 0.0, y = 0.0, z = 0.0) {
        this._values = [w, x, y, z];
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    private setValues(w: number, x: number, y: number, z: number): void {
        this._values[0] = w;
        this._values[1] = x;
        this._values[2] = y;
        this._values[3] = z;
    }

    public get values(): number[] {
        this.setValues(this.w, this.x, this.y, this.z);
        return this._values;
    }

    public zero(): void {
        this.setValues(0, 0, 0, 0);
    }

    public norm2(): number {
        return Math.sqrt(MrVector4.dot(this, this));
    }

    public vectorFromVec3(v: MrVector3): void {
        this.setValues(v.x, v.y, v.z, 0);
    }

    public pointFromVec3(v: MrVector3): void {
        this.setValues(v.x, v.y, v.z, 1);
    }

    public static add(result: MrVector4, op1: MrVector4, op2: MrVector4): void {
        result.w = op1.w + op2.w;
        result.x = op1.x + op2.x;
        result.y = op1.y + op2.y;
        result.z = op1.z + op2.z;
    }

    public static subtract(result: MrVector4, op1: MrVector4, op2: MrVector4): void {
        result.w = op1.w - op2.w;
        result.x = op1.x - op2.x;
        result.y = op1.y - op2.y;
        result.z = op1.z - op2.z;
    }

    public static multScalar(result: MrVector4, scalar: number): void {
        result.w = scalar * result.w;
        result.x = scalar * result.x;
        result.y = scalar * result.y;
        result.z = scalar * result.z;
    }

    public static dot(op1: MrVector4, op2: MrVector4): number {
        return op1.w * op2.w + op1.x * op2.x + op1.y * op2.y + op1.z * op2.z;
    }

    public static lerp(result: MrVector4, t: number, op1: MrVector4, op2: MrVector4): void {
        result.w = (1 - t) * op1.w + t * op2.w;
        result.x = (1 - t) * op1.x + t * op2.x;
        result.y = (1 - t) * op1.y + t * op2.y;
        result.z = (1 - t) * op1.z + t * op2.z;
    }

}
