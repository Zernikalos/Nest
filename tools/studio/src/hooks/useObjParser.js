import {objParser} from "@mrrobotto/exporter";

export default async function (file) {
    const content = await file.arrayBuffer()
    const decoder = new TextDecoder()
    const fileContent = decoder.decode(content)
    return objParser(fileContent)
}
