import useParseObj from "./useParseObj"

function trimExtension(fileName) {
    return fileName.replace(/\.[^/.]+$/, "")
}

export default async function (file) {
    const obj3d = await useParseObj(file)
    const {mrr} = obj3d
    const blob = new Blob([mrr], {type: "application/mrr"})
    const url = URL.createObjectURL(blob)
    const name = `${trimExtension(file.name)}.mrr`
    return {blob, url, name}
}
