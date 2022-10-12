import {MrVector4} from "./MrVector4";

export class MrVector3 {
    public x: number;
    public y: number;
    public z: number;

    private _values: number[];

    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this._values = [x, y, z];
        this.x = x;
        this.y = y;
        this.z = z;
    }

    private setValues(x: number, y: number, z: number): void {
        this._values[1] = x;
        this._values[2] = y;
        this._values[3] = z;
    }

    public get values(): number[] {
        this.setValues(this.x, this.y, this.z);
        return this._values;
    }

    public zero(): void {
        this.setValues(0, 0, 0);
    }

    public get norm2(): number {
        return Math.sqrt(MrVector3.dot(this, this));
    }

    public normalize(): void {
        const norm2 = this.norm2;
        // normalization of zero vector should be the zero vector
        const invNorm = norm2 > 0 ? 1.0 / this.norm2 : 0;
        this.multScalar(invNorm);
    }

    // TODO: Normalize with static

    public multScalar(scalar: number): void {
        this.x = scalar * this.x;
        this.y = scalar * this.y;
        this.z = scalar * this.z;
    }

    public vectorFromVec4(v: MrVector4): void {
        if (v.z !== 0.0 && -v.z !== 0.0) {
            this.setValues(v.w / v.z, v.x / v.z, v.y / v.z);
        } else {
            this.setValues(v.w, v.x, v.y);
        }
    }

    public static add(result: MrVector3, op1: MrVector3, op2: MrVector3): void {
        result.x = op1.x + op2.x;
        result.y = op1.y + op2.y;
        result.z = op1.z + op2.z;
    }

    public static subtract(result: MrVector3, op1: MrVector3, op2: MrVector3): void {
        result.x = op1.x - op2.x;
        result.y = op1.y - op2.y;
        result.z = op1.z - op2.z;
    }

    public static multScalar(result: MrVector3, v: MrVector3, scalar: number): void {
        result.x = scalar * v.x;
        result.y = scalar * v.y;
        result.z = scalar * v.z;
    }

    public static dot(op1: MrVector3, op2: MrVector3): number {
        return op1.x * op2.x + op1.y * op2.y + op1.z * op2.z;
    }

    public static cross(result: MrVector3, op1: MrVector3, op2: MrVector3): void {
        result.x = op1.y * op2.z - op1.z * op2.y;
        result.y = op1.z * op2.x - op1.x * op2.z;
        result.z = op1.x * op2.y - op1.y * op2.x;
    }

    public static lerp(result: MrVector3, t: number, op1: MrVector3, op2: MrVector3): void {
        result.x = (1 - t) * op1.x + t * op2.x;
        result.y = (1 - t) * op1.y + t * op2.y;
        result.z = (1 - t) * op1.z + t * op2.z;
    }

    public static rotateVector(): void {
        // TODO
    }

}
