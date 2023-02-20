
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

    public toJSON() {
        return [this.w, this.x, this.y, this.z]
    }
}
