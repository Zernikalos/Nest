import {parseToMrr} from "@mrrobotto/exporter";

export default async function (filePath: string) {
    return (await parseToMrr(filePath, {format: "obj"})).exportAs({format: "json", beauty: true})
}
