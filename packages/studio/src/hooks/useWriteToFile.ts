
function trimExtension(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, "")
}

export default function (fileName: string, content: string) {
    const blob = new Blob([content], {type: "application/mrr"})
    const fileUri = URL.createObjectURL(blob)
    const name = `${trimExtension(fileName)}.mrr`
    return {fileUri, name}
}
