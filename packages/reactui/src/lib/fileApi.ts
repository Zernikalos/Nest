import { api } from "@/lib/httpClient"

interface FilePath {
    path: string
    fileName: string
}

// Helper function to build file URL
function buildFileUrl(exposeId: number, fileName: string): string {
    return `http://localhost:3002/files/${exposeId}/${fileName}`
}

// Expose file and get URL
export async function getFileUrl(filePath: FilePath): Promise<string> {
    const response = await api.post("/files/expose", { path: filePath.path })
    const exposeId = response.data
    return buildFileUrl(exposeId, filePath.fileName)
}

// Get file data
export async function getFile(filePath: FilePath): Promise<ArrayBuffer> {
    const response = await api.post("/files/expose", { path: filePath.path })
    const exposeId = response.data
    const url = buildFileUrl(exposeId, filePath.fileName)
    const fileResponse = await api.get(url, { responseType: "arraybuffer" })
    
    if (fileResponse.status !== 200) {
        throw new Error(`Failed to get file: ${fileResponse.status}`)
    }
    
    return fileResponse.data
}

