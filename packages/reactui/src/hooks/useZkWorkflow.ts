import { useCallback, useState } from "react"
import { useZkLoad } from "./useZkLoad"
import { useZkParse } from "./useZkParse"
import { useZkExport } from "./useZkExport"
import type { InputFileFormat, ParseOptions, ExportOptions, ZkoParsed } from "@zernikalos/zkbuilder"

interface WorkflowState {
    currentStep: "idle" | "loading" | "parsing" | "exporting" | "completed" | "error"
    loadedFile: string | null
    parsedData: ZkoParsed | null
    exportedData: any | null
    error: string | null
}

interface UseZkWorkflowReturn extends WorkflowState {
    // Main workflow functions
    processFile: (filePath: string, format?: InputFileFormat) => Promise<void>
    exportCurrent: (options?: ExportOptions) => Promise<void>
    downloadCurrent: (filename: string, options?: ExportOptions) => Promise<void>
    
    // Individual step functions
    loadFile: (filePath: string, format?: InputFileFormat) => Promise<void>
    parseLoaded: (options?: ParseOptions) => Promise<void>
    exportParsed: (options?: ExportOptions) => Promise<void>
    
    // Utility functions
    reset: () => void
    goToStep: (step: "load" | "parse" | "export") => void
}

export function useZkWorkflow(): UseZkWorkflowReturn {
    const [workflowState, setWorkflowState] = useState<WorkflowState>({
        currentStep: "idle",
        loadedFile: null,
        parsedData: null,
        exportedData: null,
        error: null
    })

    const { loadFile: zkLoadFile, data: loadedData, loading: loadLoading, error: loadError } = useZkLoad()
    const { parseObject, data: parsedData, loading: parseLoading, error: parseError } = useZkParse()
    const { exportFile, downloadFile, data: exportedData, loading: exportLoading, error: exportError } = useZkExport()

    const loadFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setWorkflowState(prev => ({ ...prev, currentStep: "loading", error: null }))
        await zkLoadFile(filePath, format)
        setWorkflowState(prev => ({ 
            ...prev, 
            currentStep: loadError ? "error" : "idle",
            loadedFile: filePath,
            error: loadError
        }))
    }, [zkLoadFile, loadError])

    const parseLoaded = useCallback(async (options?: ParseOptions) => {
        if (!loadedData) {
            setWorkflowState(prev => ({ ...prev, error: "No file loaded to parse" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "parsing", error: null }))
        await parseObject(loadedData, options)
        setWorkflowState(prev => ({ 
            ...prev, 
            currentStep: parseError ? "error" : "idle",
            parsedData: parsedData,
            error: parseError
        }))
    }, [loadedData, parseObject, parsedData, parseError])

    const exportParsed = useCallback(async (options?: ExportOptions) => {
        if (!parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to export" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        await exportFile(parsedData, options)
        setWorkflowState(prev => ({ 
            ...prev, 
            currentStep: exportError ? "error" : "completed",
            exportedData: exportedData,
            error: exportError
        }))
    }, [parsedData, exportFile, exportedData, exportError])

    const processFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setWorkflowState(prev => ({ ...prev, currentStep: "loading", error: null }))
        
        try {
            // Load
            await zkLoadFile(filePath, format)
            if (loadError) throw new Error(loadError)
            
            setWorkflowState(prev => ({ ...prev, currentStep: "parsing", loadedFile: filePath }))
            
            // Parse
            if (loadedData) {
                await parseObject(loadedData)
                if (parseError) throw new Error(parseError)
            }
            
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "completed",
                parsedData: parsedData,
                error: null
            }))
        } catch (error) {
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }))
        }
    }, [zkLoadFile, loadError, loadedData, parseObject, parseError, parsedData])

    const exportCurrent = useCallback(async (options?: ExportOptions) => {
        if (!parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to export" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        await exportFile(parsedData, options)
        setWorkflowState(prev => ({ 
            ...prev, 
            currentStep: exportError ? "error" : "completed",
            exportedData: exportedData,
            error: exportError
        }))
    }, [parsedData, exportFile, exportedData, exportError])

    const downloadCurrent = useCallback(async (filename: string, options?: ExportOptions) => {
        if (!parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to download" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        await downloadFile(parsedData, filename, options)
        setWorkflowState(prev => ({ 
            ...prev, 
            currentStep: exportError ? "error" : "completed",
            exportedData: exportedData,
            error: exportError
        }))
    }, [parsedData, downloadFile, exportedData, exportError])

    const reset = useCallback(() => {
        setWorkflowState({
            currentStep: "idle",
            loadedFile: null,
            parsedData: null,
            exportedData: null,
            error: null
        })
    }, [])

    const goToStep = useCallback((step: "load" | "parse" | "export") => {
        setWorkflowState(prev => ({ ...prev, currentStep: "idle" }))
    }, [])

    return {
        ...workflowState,
        processFile,
        exportCurrent,
        downloadCurrent,
        loadFile,
        parseLoaded,
        exportParsed,
        reset,
        goToStep
    }
} 