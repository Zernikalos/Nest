import httpClient from "../toolbox/httpClient"

async function expose(filePath: string): Promise<number> {
    return (await httpClient.post("/files/expose", {path: filePath})).data
}

function buildFilePath(exposeId: number, fileName: string) {
    // @ts-ignore
    return `${import.meta.env.VITE_STUDIO_SERVER_HOST}/files/${exposeId}/${fileName}`
}

export async function getUrlForFile(filePath: string, fileName: string) {
    const exposeId = await expose(filePath)
    return buildFilePath(exposeId, fileName)
}

export async function getFile(exposeId: number, fileName: string) {
    return await httpClient.get(`/files/${exposeId}/${fileName}`)
}
