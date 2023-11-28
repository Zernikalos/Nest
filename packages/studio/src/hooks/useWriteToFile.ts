
function trimExtension(fileName: string) {
    return fileName.replace(/\.[^/.]+$/, "")
}

export default function (fileName: string, content: string) {
    const blob = new Blob([content], {type: "application/zko"})
    const fileUri = URL.createObjectURL(blob)
    const name = `${trimExtension(fileName)}.zko`
    return {fileUri, name}
}
