import {mrrExporter} from "@mrrobotto/exporter";

function trimExtension(fileName) {
    return fileName.replace(/\.[^/.]+$/, "")
}

async function parseFile(file) {
    const content = await file.arrayBuffer()
    const decoder = new TextDecoder()
    const fileContent = decoder.decode(content)
    return mrrExporter.objParser(fileContent)
}

export default async function (file) {
    const obj3d = await parseFile(file)
    const {mrr, hex} = obj3d
    const blob = new Blob([mrr], {type: "application/mrr"})
    const url = URL.createObjectURL(blob)
    const name = `${trimExtension(file.name)}.mrr`
    return {blob, url, name, hex}
}
