import {defineStore} from "pinia"
import {api} from "./httpClient"
import {AxiosResponse} from "axios";

export const useFileApiStore = defineStore("fileApi", () => {
    async function __expose(filePath: string): Promise<number> {
        return (await api.post("/files/expose", {path: filePath})).data
    }

    function __buildFileUrl(exposeId: number, fileName: string): string {
        // TODO: Localhost is being used here
        return `http://localhost:3000/files/${exposeId}/${fileName}`
    }

    async function getUrlForFile(filePath: {path: string, fileName: string}): Promise<string> {
        const exposeId = await __expose(filePath.path)
        return __buildFileUrl(exposeId, filePath.fileName)
    }

    async function getFile(filePath: {path: string, fileName: string}): Promise<any> {
        const exposeId = await __expose(filePath.path)
        const url = __buildFileUrl(exposeId, filePath.fileName)
        const response = await api.get(url,  {responseType: "arraybuffer"})
        if (response.status !== 200) {
            return
        }
        return response.data
    }

    return {getUrlForFile, getFile}
})
