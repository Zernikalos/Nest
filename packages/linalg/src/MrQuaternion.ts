import {MrMatrix4} from "./MrMatrix4";
import {MrVector3} from "./MrVector3";

export class MrQuaternion {

    public w: number;
    public x: number;
    public y: number;
    public z: number;

    constructor(w = 1.0, x = 0.0, y = 0.0, z = 0.0) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public get values(): number[] {
        return [this.w, this.x, this.y, this.z];
    }

    public setValues(w: number, x: number, y: number, z: number): void {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public setIdentity(): void {
        this.setValues(1.0, 0.0, 0.0, 0.0);
    }

    public setZero(): void {
        this.setValues(0.0, 0.0, 0.0, 0.0);
    }

    public static add(result: MrQuaternion, q1: MrQuaternion, q2: MrQuaternion): void {
        result.x = q1.x + q2.x;
        result.y = q1.y + q2.y;
        result.z = q1.z + q2.z;
        result.w = q1.w + q2.w;
    }

    public static substract(result: MrQuaternion, q1: MrQuaternion, q2: MrQuaternion): void {
        result.x = q1.x - q2.x;
        result.y = q1.y - q2.y;
        result.z = q1.z - q2.z;
        result.w = q1.w - q2.w;
    }

    public static conjugate(result: MrQuaternion, q: MrQuaternion): void {
        result.w = q.w;
        result.x = -q.x;
        result.y = -q.y;
        result.z = -q.z;
    }

    public get norm2(): number {
        return Math.sqrt(MrQuaternion.dot(this, this));
    }

    public static dot(q1: MrQuaternion, q2: MrQuaternion): number {
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    }

    public static mult(result: MrQuaternion, q1: MrQuaternion, q2: MrQuaternion): void {
        const x1 = q1.x, y1 = q1.y, z1 = q1.z, w1 = q1.w;
        const x2 = q2.x, y2 = q2.y, z2 = q2.z, w2 = q2.w;
        result.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        result.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
        result.y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2;
        result.z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2;
    }

    public multScalar(r: number): void {
        this.w = this.w * r;
        this.x = this.x * r;
        this.y = this.y * r;
        this.z = this.z * r;
    }

    public static multScalar(result: MrQuaternion, r: number, q: MrQuaternion): void {
        result.w = q.w * r;
        result.x = q.x * r;
        result.y = q.y * r;
        result.z = q.z * r;
    }

    public normalize(): void {
        const n = this.norm2;
        this.multScalar(1 / n);
    }

    public static normalize(result: MrQuaternion, q: MrQuaternion): void {
        const n = q.norm2;
        MrQuaternion.multScalar(result, 1 / n, q);
    }

    public static invert(result: MrQuaternion, q: MrQuaternion): void {
        const n2 = MrQuaternion.dot(q, q);
        MrQuaternion.conjugate(result, q);
        MrQuaternion.multScalar(result, n2, result);
    }

    public rotate(angle: number, axis: MrVector3): void {
        const opRot = new MrQuaternion(this.w, this.x, this.y, this.z);
        MrQuaternion.fromAngleAxis(opRot, angle, axis);
        MrQuaternion.mult(this, this, opRot);
    }

    public static rotate(result: MrQuaternion, q: MrQuaternion, angle: number, axis: MrVector3): void {
        const opRot = new MrQuaternion(q.w, q.x, q.y, q.z);
        MrQuaternion.fromAngleAxis(opRot, angle, axis);
        MrQuaternion.mult(result, result, opRot);
    }

    public static fromAngleAxis(result: MrQuaternion, angle: number, axis: MrVector3): void {
        //Axis normalization
        let norm = axis.norm2;
        norm = 1 / norm;
        const xn = axis.x * norm;
        const yn = axis.y * norm;
        const zn = axis.z * norm;

        //Calc of cos(angle/2) and sin(angle/2)
        const a = angle / 2.0 * (Math.PI/180); // Math.toRadians(angle / 2);
        const c = Math.cos(a);
        const s = Math.sin(a);

        //The values of the quaternion will be
        //[cos(angle/2), axis.x*sin(angle/2), axis.y*sin(angle/2), axis.z*sin(angle/2)]
        result.w = c;
        result.x = s * xn;
        result.y = s * yn;
        result.z = s * zn;
        MrQuaternion.normalize(result, result);
    }

    public fromVec3(v: MrVector3): void {
        this.w = 0;
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    public static fromVec3(result: MrQuaternion, v: MrVector3): void {
        result.w = 0;
        result.x = v.x;
        result.y = v.y;
        result.z = v.z;
    }

    //TODO: Optimize this method
    public fromMatrix4(result: MrQuaternion, m: MrMatrix4): void {
        const v = m.values;
        const m00 = v[0],
            m01 = v[4],
            m02 = v[8],
            m10 = v[1],
            m11 = v[5],
            m12 = v[9],
            m20 = v[2],
            m21 = v[6],
            m22 = v[10];
        let S, qw, qx, qy, qz;
        const trace = m00 + m11 + m22; // I removed + 1.0f; see discussion with Ethan
        if (trace > 0) {// I changed M_EPSILON to 0
            S = 0.5 / Math.sqrt(trace + 1.0);
            qw = 0.25 / S;
            qx = (m21 - m12) * S;
            qy = (m02 - m20) * S;
            qz = (m10 - m01) * S;
        } else {
            if (m00 > m11 && m00 > m22) {
                S = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
                qw = (m21 - m12) / S;
                qx = 0.25 * S;
                qy = (m01 + m10) / S;
                qz = (m02 + m20) / S;
            } else if (m11 > m22) {
                S = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
                qw = (m02 - m20) / S;
                qx = (m01 + m10) / S;
                qy = 0.25 * S;
                qz = (m12 + m21) / S;
            } else {
                S = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
                qw = (m10 - m01) / S;
                qx = (m02 + m20) / S;
                qy = (m12 + m21) / S;
                qz = 0.25 * S;
            }
        }

        result.w = qw;
        result.x = qx;
        result.y = qy;
        result.z = qz;
    }

    public static slerp(result: MrQuaternion, t: number, q1: MrQuaternion, q2: MrQuaternion): void {
        result.w = (1 - t) * q1.w + t * q2.w;
        result.x = (1 - t) * q1.x + t * q2.x;
        result.y = (1 - t) * q1.y + t * q2.y;
        result.z = (1 - t) * q1.z + t * q2.z;
        MrQuaternion.normalize(result, result);
    }

}
