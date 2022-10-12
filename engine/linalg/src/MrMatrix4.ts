import {MrVector3} from "./MrVector3";

/**
 * Matrix 4x4 representation class
 */
export class MrMatrix4 {

    private _values: number[];

    /**
     * Values in matrix will represent the values inside the matrix
     * and they are specified using column-first order
     * @param values
     */
    constructor(values?: number[]) {
        this._values = Array(16);
        if (values) {
            this.copyValues(values);
        }
    }

    private copyValues(values: number[]) {
        for (let i = 0; i < 16; i++) {
            this._values[i] = values[i];
        }
    }

    public get values(): number[] {
        return this._values;
    }

    public identity(): void {
        this._values[0] = 1;
        this._values[1] = 0;
        this._values[2] = 0;
        this._values[3] = 0;

        this._values[4] = 0;
        this._values[5] = 1;
        this._values[6] = 0;
        this._values[7] = 0;

        this._values[8] = 0;
        this._values[9] = 0;
        this._values[10] = 1;
        this._values[11] = 0;

        this._values[12] = 0;
        this._values[13] = 0;
        this._values[14] = 0;
        this._values[15] = 1;
    }

    public setValueAt(i: number, j: number, v?: number): void {
        let k;
        if (typeof v === "number") {
            k = 4 * j + i
            this._values[k] = v;
        } else {
            k = i;
            v = j;
            this._values[k] = v;
        }
    }

    public getValueAt(i: number, j?: number): number {
        let k;
        if (typeof j === "number") {
            k = 4 * j + i;
            return this._values[k];
        } else {
            k = i;
            return this._values[k];
        }
    }

    public static add(result: MrMatrix4, m1: MrMatrix4, m2: MrMatrix4): void {
        for (let i = 0; i < 16; i++) {
            result._values[i] = m1._values[i] + m2._values[i];
        }
    }

    public static subtract(result: MrMatrix4, m1: MrMatrix4, m2: MrMatrix4): void {
        for (let i = 0; i < 16; i++) {
            result._values[i] = m1._values[i] - m2._values[i];
        }
    }

    public static mult(result: MrMatrix4, rm: MrMatrix4, lm: MrMatrix4): void {
        for (let i = 0 ; i < 4 ; i++) {
            const rm_i0 = rm._values[4 * i];
            let ri0 = lm._values[0] * rm_i0;
            let ri1 = lm._values[1] * rm_i0;
            let ri2 = lm._values[2] * rm_i0;
            let ri3 = lm._values[3] * rm_i0;

            for (let j = 1 ; j < 4 ; j++) {
                const rm_ij = rm._values[j + 4 * i];
                ri0 += lm._values[4 * j] * rm_ij;
                ri1 += lm._values[1 + 4 * j] * rm_ij;
                ri2 += lm._values[2 + 4 * j] * rm_ij;
                ri3 += lm._values[3 + 4 * j] * rm_ij;
            }
            result._values[4 * i] = ri0;
            result._values[1 + 4 * i] = ri1;
            result._values[2 + 4 * i] = ri2;
            result._values[3 + 4 * i] = ri3;
        }

    }

    public static transpose(result: MrMatrix4, m: MrMatrix4): void {
        for (let i = 0; i < 4; i++) {
            const k = i * 4;
            result._values[i] = m._values[k];
            result._values[i + 4] = m._values[k + 1];
            result._values[i + 8] = m._values[k + 2];
            result._values[i + 12] = m._values[k + 3];
        }
    }

    public static translate(result: MrMatrix4, m: MrMatrix4, translation: MrVector3): void {
        for (let i = 0; i < 12; i++) {
            result._values[i] = m._values[i];
        }
        for (let i = 0; i < 4; i++) {
            result._values[12 + i] =
                m._values[i] * translation.x +
                m._values[4 + i] * translation.y +
                m._values[8 + i] * translation.z +
                m._values[12 + i];
        }
    }

    public static translateIP(result: MrMatrix4,translation: MrVector3): void {
        for (let i = 0; i < 4; i++) {
            result._values[12 + i] =
                result._values[i] * translation.x +
                result._values[4 + i] * translation.y +
                result._values[8 + i] * translation.z +
                result._values[12 + i];
        }
    }

    public static invert(result: MrMatrix4, m: MrMatrix4): boolean {
        const src0  = m._values[0];
        const src4  = m._values[1];
        const src8  = m._values[2];
        const src12 = m._values[3];
        const src1  = m._values[4];
        const src5  = m._values[5];
        const src9  = m._values[6];
        const src13 = m._values[7];
        const src2  = m._values[8];
        const src6  = m._values[9];
        const src10 = m._values[10];
        const src14 = m._values[11];
        const src3  = m._values[12];
        const src7  = m._values[13];
        const src11 = m._values[14];
        const src15 = m._values[15];

        // calculate pairs for first 8 elements (cofactors)
        const atmp0  = src10 * src15;
        const atmp1  = src11 * src14;
        const atmp2  = src9  * src15;
        const atmp3  = src11 * src13;
        const atmp4  = src9  * src14;
        const atmp5  = src10 * src13;
        const atmp6  = src8  * src15;
        const atmp7  = src11 * src12;
        const atmp8  = src8  * src14;
        const atmp9  = src10 * src12;
        const atmp10 = src8  * src13;
        const atmp11 = src9  * src12;

        // calculate first 8 elements (cofactors)
        const dst0  = (atmp0 * src5 + atmp3 * src6 + atmp4  * src7)
            - (atmp1 * src5 + atmp2 * src6 + atmp5  * src7);
        const dst1  = (atmp1 * src4 + atmp6 * src6 + atmp9  * src7)
            - (atmp0 * src4 + atmp7 * src6 + atmp8  * src7);
        const dst2  = (atmp2 * src4 + atmp7 * src5 + atmp10 * src7)
            - (atmp3 * src4 + atmp6 * src5 + atmp11 * src7);
        const dst3  = (atmp5 * src4 + atmp8 * src5 + atmp11 * src6)
            - (atmp4 * src4 + atmp9 * src5 + atmp10 * src6);
        const dst4  = (atmp1 * src1 + atmp2 * src2 + atmp5  * src3)
            - (atmp0 * src1 + atmp3 * src2 + atmp4  * src3);
        const dst5  = (atmp0 * src0 + atmp7 * src2 + atmp8  * src3)
            - (atmp1 * src0 + atmp6 * src2 + atmp9  * src3);
        const dst6  = (atmp3 * src0 + atmp6 * src1 + atmp11 * src3)
            - (atmp2 * src0 + atmp7 * src1 + atmp10 * src3);
        const dst7  = (atmp4 * src0 + atmp9 * src1 + atmp10 * src2)
            - (atmp5 * src0 + atmp8 * src1 + atmp11 * src2);

        // calculate pairs for second 8 elements (cofactors)
        const btmp0  = src2 * src7;
        const btmp1  = src3 * src6;
        const btmp2  = src1 * src7;
        const btmp3  = src3 * src5;
        const btmp4  = src1 * src6;
        const btmp5  = src2 * src5;
        const btmp6  = src0 * src7;
        const btmp7  = src3 * src4;
        const btmp8  = src0 * src6;
        const btmp9  = src2 * src4;
        const btmp10 = src0 * src5;
        const btmp11 = src1 * src4;

        // calculate second 8 elements (cofactors)
        const dst8  = (btmp0  * src13 + btmp3  * src14 + btmp4  * src15)
            - (btmp1  * src13 + btmp2  * src14 + btmp5  * src15);
        const dst9  = (btmp1  * src12 + btmp6  * src14 + btmp9  * src15)
            - (btmp0  * src12 + btmp7  * src14 + btmp8  * src15);
        const dst10 = (btmp2  * src12 + btmp7  * src13 + btmp10 * src15)
            - (btmp3  * src12 + btmp6  * src13 + btmp11 * src15);
        const dst11 = (btmp5  * src12 + btmp8  * src13 + btmp11 * src14)
            - (btmp4  * src12 + btmp9  * src13 + btmp10 * src14);
        const dst12 = (btmp2  * src10 + btmp5  * src11 + btmp1  * src9 )
            - (btmp4  * src11 + btmp0  * src9  + btmp3  * src10);
        const dst13 = (btmp8  * src11 + btmp0  * src8  + btmp7  * src10)
            - (btmp6  * src10 + btmp9  * src11 + btmp1  * src8 );
        const dst14 = (btmp6  * src9  + btmp11 * src11 + btmp3  * src8 )
            - (btmp10 * src11 + btmp2  * src8  + btmp7  * src9 );
        const dst15 = (btmp10 * src10 + btmp4  * src8  + btmp9  * src9 )
            - (btmp8  * src9  + btmp11 * src10 + btmp5  * src8 );

        // calculate determinant
        const det = src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;
        if (det === 0.0) {
            return false;
        }

        // calculate matrix inverse
        const invDet = 1.0 / det;
        result._values[0] = dst0  * invDet;
        result._values[1] = dst1  * invDet;
        result._values[2] = dst2  * invDet;
        result._values[3] = dst3  * invDet;

        result._values[4] = dst4  * invDet;
        result._values[5] = dst5  * invDet;
        result._values[6] = dst6  * invDet;
        result._values[7] = dst7  * invDet;

        result._values[8] = dst8  * invDet;
        result._values[9] = dst9  * invDet;
        result._values[10] = dst10 * invDet;
        result._values[11] = dst11 * invDet;

        result._values[12] = dst12 * invDet;
        result._values[13] = dst13 * invDet;
        result._values[14] = dst14 * invDet;
        result._values[15] = dst15 * invDet;

        return true;
    }

    public static lookAt(result: MrMatrix4, eye: MrVector3, center: MrVector3, up: MrVector3): void {
        const f = new MrVector3();

        // See the OpenGL GLUT documentation for gluLookAt for a description
        // of the algorithm. We implement it in a straightforward way:
        MrVector3.subtract(f, center, eye);

        // Normalize f
        f.normalize();

        // compute s = f x up (x means "cross product")
        const s = new MrVector3();
        MrVector3.cross(s, f, up);

        // and normalize s
        s.normalize();

        // compute u = s x f
        const u = new MrVector3();
        MrVector3.cross(u, s, f);

        result._values[0] = s.x;
        result._values[1] = u.x;
        result._values[2] = -f.x;
        result._values[3] = 0.0;

        result._values[4] = s.y;
        result._values[5] = u.y;
        result._values[6] = -f.y;
        result._values[7] = 0.0;

        result._values[8] = s.z;
        result._values[9] = u.z;
        result._values[10] = -f.z;
        result._values[11] = 0.0;

        result._values[12] = 0.0;
        result._values[13] = 0.0;
        result._values[14] = 0.0;
        result._values[15] = 1.0;

        const negEye = new MrVector3();
        MrVector3.multScalar(negEye, eye, -1.0);
        MrMatrix4.translateIP(result, negEye);
    }

    public toString(): string {
        return`|${this._values[0]} ${this._values[4]} ${this._values[8]} ${this._values[12]}|\n`+
        `|${this._values[1]} ${this._values[5]} ${this._values[9]} ${this._values[13]}|\n`+
        `|${this._values[2]} ${this._values[6]} ${this._values[10]} ${this._values[14]}|\n`+
        `|${this._values[3]} ${this._values[7]} ${this._values[11]} ${this._values[15]}|`;
    }
}
