import {parseToMrr} from "@mrrobotto/exporter";

export default function (content: string) {
    return parseToMrr(content, {format: "obj"}).exportAs({format: "hexcbor", beauty: true})
}
