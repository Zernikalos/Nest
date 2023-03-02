
export class Float {
    constructor(public value: number) {
    }

    encodeCBOR(encoder: any) {
        return encoder._pushFloat(Math.fround(this.value))
    }
}

