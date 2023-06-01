import {defineStore} from "pinia"
import {api} from "boot/axios"

export const useFileApiStore = defineStore("fileApi", () => {
    async function expose(filePath: string): Promise<number> {
        return (await api.post("/files/expose", {path: filePath})).data
    }

    function buildFilePath(exposeId: number, fileName: string) {
    // @ts-ignore
        return `${process.env.STUDIO_API}/files/${exposeId}/${fileName}`
    }

    async function getUrlForFile(filePath: string, fileName: string) {
        const exposeId = await expose(filePath)
        return buildFilePath(exposeId, fileName)
    }

    async function getFile(exposeId: number, fileName: string) {
        return await api.get(`/files/${exposeId}/${fileName}`)
    }

    return {getUrlForFile, getFile}
})
