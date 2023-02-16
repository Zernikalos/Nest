import httpClient from "../toolbox/httpClient"

export async function expose(filePath: string): Promise<number> {
    return (await httpClient.post("/files/expose", {path: filePath})).data
}

export function buildFilePath(exposeId: number, fileName: string) {
    // @ts-ignore
    return `${import.meta.env.VITE_STUDIO_SERVER_HOST}/files/${exposeId}/${fileName}`
}

export async function getFile(exposeId: number, fileName: string) {
    return await httpClient.get(`/files/${exposeId}/${fileName}`)
}
