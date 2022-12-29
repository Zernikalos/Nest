
export class MrBuffer {
    targetBuffer: 'array' | 'element'
    usage: 'static-draw'
    dataArray: Uint8Array | ArrayLike<number>

    constructor() {
        this.usage = "static-draw"
    }
}
