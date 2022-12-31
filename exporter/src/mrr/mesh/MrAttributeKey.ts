export class MrAttributeKey {
    static INDEX_COUNT = 0

    index = 0
    size = 0
    count = 0
    normalized = false
    offset = 0
    stride = 0

    constructor() {
        this.index = MrAttributeKey.INDEX_COUNT
        MrAttributeKey.INDEX_COUNT++
    }
}
