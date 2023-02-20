
export class MrVector3 {
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    public toJSON() {
        return [this.x, this.y, this.z]
    }
}
