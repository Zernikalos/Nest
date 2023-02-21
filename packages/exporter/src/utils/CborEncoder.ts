// @ts-ignore
import * as cbor from "cbor-web"

export class CborEncoder {

    public encode(object: object) {
        return cbor.encode(object)
    }
}
//
// export abstract class CborSerializable {
//
//     encode(): object {
//         return this
//     }
//
//     encodeCBOR(encoder: any) {
//         return encoder._pushFloat(this.value)
//     }
// }
