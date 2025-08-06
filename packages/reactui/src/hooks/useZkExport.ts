import { useState, useCallback } from "react"
import { zkExport } from "@zernikalos/zkbuilder"
import type { ExportOptions, ZkoParsed } from "@zernikalos/zkbuilder"

interface UseZkExportState {
    data: string | Uint8Array | any | null
    loading: boolean
    error: string | null
}

interface UseZkExportReturn extends UseZkExportState {
    exportFile: (zkParsed: ZkoParsed, options?: ExportOptions) => Promise<void>
    downloadFile: (zkParsed: ZkoParsed, filename: string, options?: ExportOptions) => Promise<void>
    reset: () => void
}

export function useZkExport(): UseZkExportReturn {
    const [state, setState] = useState<UseZkExportState>({
        data: null,
        loading: false,
        error: null
    })

    const exportFile = useCallback(async (zkParsed: ZkoParsed, options?: ExportOptions) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        try {
            const result = await zkExport(zkParsed, options)
            setState({
                data: result,
                loading: false,
                error: null
            })
        } catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            })
        }
    }, [])

    const downloadFile = useCallback(async (zkParsed: ZkoParsed, filename: string, options?: ExportOptions) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        try {
            const result = await zkExport(zkParsed, options)
            
            // Create blob and download
            let blob: Blob
            let mimeType: string
            
            if (options?.format === "proto") {
                blob = new Blob([result as Uint8Array], { type: "application/octet-stream" })
                mimeType = "application/octet-stream"
            } else {
                const content = typeof result === "string" ? result : JSON.stringify(result)
                blob = new Blob([content], { type: "application/json" })
                mimeType = "application/json"
            }
            
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            setState({
                data: result,
                loading: false,
                error: null
            })
        } catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            })
        }
    }, [])

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null
        })
    }, [])

    return {
        ...state,
        exportFile,
        downloadFile,
        reset
    }
} 