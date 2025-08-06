import { useCallback, useState } from "react"
import { useZkLoad } from "./useZkLoad"
import { useZkParse } from "./useZkParse"
import { useZkExport } from "./useZkExport"
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

    const { loadFile: zkLoadFile, reset: resetLoad } = useZkLoad()
    const { parseObject, reset: resetParse } = useZkParse()
    const { exportFile, downloadFile, reset: resetExport } = useZkExport()

    const loadFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setWorkflowState(prev => ({ ...prev, currentStep: "loading", error: null }))
        try {
            const loadedData = await zkLoadFile(filePath, format)
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
    }, [zkLoadFile])

    const parseLoaded = useCallback(async (options?: ParseOptions) => {
        if (!workflowState.loadedData) {
            setWorkflowState(prev => ({ ...prev, error: "No file loaded to parse" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "parsing", error: null }))
        try {
            const parsedData = await parseObject(workflowState.loadedData, options)
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
    }, [parseObject, workflowState.loadedData])

    const exportParsed = useCallback(async (options?: ExportOptions) => {
        if (!workflowState.parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to export" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        try {
            const exportedData = await exportFile(workflowState.parsedData, options)
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
    }, [exportFile, workflowState.parsedData])

    const processFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setWorkflowState(prev => ({ ...prev, currentStep: "loading", error: null }))
        
        try {
            // Load
            console.log('🔄 Loading file...')
            const loadedData = await zkLoadFile(filePath, format)
            console.log('✅ File loaded:', loadedData)
            
            setWorkflowState(prev => ({ 
                ...prev, 
                currentStep: "parsing", 
                loadedFile: filePath,
                loadedData: loadedData
            }))
            
            // Parse
            console.log('🔄 Parsing file...')
            const parsedData = await parseObject(loadedData)
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
    }, [zkLoadFile, parseObject])

    const exportCurrent = useCallback(async (options?: ExportOptions) => {
        if (!workflowState.parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to export" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        try {
            const exportedData = await exportFile(workflowState.parsedData, options)
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
    }, [exportFile, workflowState.parsedData])

    const downloadCurrent = useCallback(async (filename: string, options?: ExportOptions) => {
        if (!workflowState.parsedData) {
            setWorkflowState(prev => ({ ...prev, error: "No parsed data to download" }))
            return
        }

        setWorkflowState(prev => ({ ...prev, currentStep: "exporting", error: null }))
        try {
            await downloadFile(workflowState.parsedData, filename, options)
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
    }, [downloadFile, workflowState.parsedData])

    const reset = useCallback(() => {
        setWorkflowState({
            currentStep: "idle",
            loadedFile: null,
            loadedData: null,
            parsedData: null,
            exportedData: null,
            error: null
        })
        resetLoad()
        resetParse()
        resetExport()
    }, [resetLoad, resetParse, resetExport])

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