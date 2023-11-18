import {defineStore} from "pinia"
import {api} from "./httpClient"
import _ from "lodash";

export const useFileApiStore = defineStore("fileApi", () => {
    async function __expose(filePath: string): Promise<number> {
        return (await api.post("/files/expose", {path: filePath})).data
    }

    function __buildFileUrl(exposeId: number, fileName: string): string {
    // @ts-ignore
        return `http://localhost:3000/files/${exposeId}/${fileName}`
    }

    async function getUrlForFile(filePath: {path: string, fileName: string}): Promise<string> {
        const exposeId = await __expose(filePath.path)
        return __buildFileUrl(exposeId, filePath.fileName)
    }

    return {getUrlForFile}
})
