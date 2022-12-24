import {mrrExport} from "@mrrobotto/exporter";

function trimExtension(fileName) {
    return fileName.replace(/\.[^/.]+$/, "")
}

async function parseFile(file) {
    const content = await file.arrayBuffer()
    const decoder = new TextDecoder()
    const fileContent = decoder.decode(content)
    return mrrExport(fileContent, {importFormat: 'obj', exportFormat: 'json'})
}

export default async function (file) {
    const data = await parseFile(file)

    const blob = new Blob([data], {type: "application/mrr"})
    const url = URL.createObjectURL(blob)
    const name = `${trimExtension(file.name)}.mrr`
    return {blob, url, name, data}
}
