import { useMutation } from "@tanstack/react-query"
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
async function getFileUrl(filePath: FilePath): Promise<string> {
    const response = await api.post("/files/expose", { path: filePath.path })
    const exposeId = response.data
    return buildFileUrl(exposeId, filePath.fileName)
}

// Get file data
async function getFile(filePath: FilePath): Promise<ArrayBuffer> {
    const response = await api.post("/files/expose", { path: filePath.path })
    const exposeId = response.data
    const url = buildFileUrl(exposeId, filePath.fileName)
    const fileResponse = await api.get(url, { responseType: "arraybuffer" })
    
    if (fileResponse.status !== 200) {
        throw new Error(`Failed to get file: ${fileResponse.status}`)
    }
    
    return fileResponse.data
}

export function useFileApi() {
    const getFileMutation = useMutation({
        mutationFn: getFile,
        onError: (error) => {
            console.error("Error getting file:", error)
        }
    })

    const getFileUrlMutation = useMutation({
        mutationFn: getFileUrl,
        onError: (error) => {
            console.error("Error getting file URL:", error)
        }
    })

    return {
        getFile: getFileMutation.mutateAsync,
        getFileUrl: getFileUrlMutation.mutateAsync,
        isLoading: getFileMutation.isPending || getFileUrlMutation.isPending,
        error: getFileMutation.error || getFileUrlMutation.error
    }
} 