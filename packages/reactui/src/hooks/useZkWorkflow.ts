import { useCallback, useState } from "react"
import { zkLoad, zkParse, zkExport } from "@zernikalos/zkbuilder"
import type { InputFileFormat, ParseOptions, ExportOptions, ZkoParsed, ZkoParseableObject } from "@zernikalos/zkbuilder"

interface WorkflowState {
    currentStep: "idle" | "loading" | "parsing" | "exporting" | "completed" | "error"
    loadedFile: string | null
    loadedData: ZkoParseableObject | null
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
        loadedData: null,
        parsedData: null,
        exportedData: null,
        error: null
    })

    const loadFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setWorkflowState(prev => ({ ...prev, currentStep: "loading", error: null }))
        try {
            const loadedData = await zkLoad({ filePath, format })
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "idle",
                loadedFile: filePath,
                loadedData: loadedData,
                error: null
            }))
        } catch (error) {
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }))
        }
    }, [])

    const parseLoaded = useCallback(async (options?: ParseOptions) => {
        if (!workflowState.loadedData) {
            setWorkflowState(prev => ({ ...prev, error: "No file loaded to parse" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "parsing", error: null }))
        try {
            const parsedData = await zkParse(workflowState.loadedData, options)
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "idle",
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
    }, [workflowState.loadedData])

    const exportParsed = useCallback(async (options?: ExportOptions) => {
        if (!workflowState.parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to export" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        try {
            const exportedData = await zkExport(workflowState.parsedData, options)
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "completed",
                exportedData: exportedData,
                error: null
            }))
        } catch (error) {
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }))
        }
    }, [workflowState.parsedData])

    const processFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setWorkflowState(prev => ({ ...prev, currentStep: "loading", error: null }))
        
        try {
            // Load
            console.log('🔄 Loading file...')
            const loadedData = await zkLoad({ filePath, format })
            console.log('✅ File loaded:', loadedData)
            
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "parsing", 
                loadedFile: filePath,
                loadedData: loadedData
            }))
            
            // Parse
            console.log('🔄 Parsing file...')
            const parsedData = await zkParse(loadedData)
            console.log('✅ File parsed:', parsedData)
            
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "completed",
                parsedData: parsedData,
                error: null
            }))
        } catch (error) {
            console.error('❌ Workflow failed:', error)
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }))
        }
    }, [])

    const exportCurrent = useCallback(async (options?: ExportOptions) => {
        if (!workflowState.parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to export" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        try {
            const exportedData = await zkExport(workflowState.parsedData, options)
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "completed",
                exportedData: exportedData,
                error: null
            }))
        } catch (error) {
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }))
        }
    }, [workflowState.parsedData])

    const downloadCurrent = useCallback(async (filename: string, options?: ExportOptions) => {
        if (!workflowState.parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to download" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        try {
            const result = await zkExport(workflowState.parsedData, options)
            
            // Create blob and download
            let blob: Blob
            
            if (options?.format === "proto") {
                blob = new Blob([result as Uint8Array], { type: "application/octet-stream" })
            } else {
                const content = typeof result === "string" ? result : JSON.stringify(result)
                blob = new Blob([content], { type: "application/json" })
            }
            
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "completed",
                error: null
            }))
        } catch (error) {
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "error",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }))
        }
    }, [workflowState.parsedData])

    const reset = useCallback(() => {
        setWorkflowState({
            currentStep: "idle",
            loadedFile: null,
            loadedData: null,
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