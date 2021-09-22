
/**
 * Vector of 4 components
 */
export class MrVector4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x = 0.0, y = 0.0, z = 0.0, w = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

}
