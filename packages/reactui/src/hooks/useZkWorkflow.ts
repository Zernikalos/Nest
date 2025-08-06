import { zkLoad, zkParse, zkExport } from "@zernikalos/zkbuilder"
import type { InputFileFormat, ExportOptions, ZkoParsed, ZkoParseableObject } from "@zernikalos/zkbuilder"

export interface WorkflowState {
    currentStep: "idle" | "loading" | "parsing" | "completed" | "error"
    loadedFile: string | null
    loadedData: ZkoParseableObject | null
    parsedData: ZkoParsed | null
    exportedData: any | null
    error: string | null
}

interface UseZkWorkflowReturn {
    processFile: (filePath: string, format?: InputFileFormat) => Promise<WorkflowState>
    exportWorkflow: (workflowState: WorkflowState, options?: ExportOptions) => Promise<any>
}

export function useZkWorkflow(): UseZkWorkflowReturn {
    const processFile = async (filePath: string, format?: InputFileFormat): Promise<WorkflowState> => {
        try {
            // Load file
            console.log('🔄 Loading file...', filePath, format)
            const loadedData = await zkLoad({ filePath, format })
            console.log('✅ File loaded:', loadedData)
            
            // Parse file
            console.log('🔄 Parsing file...')
            const parsedData = await zkParse(loadedData, format)
            console.log('✅ File parsed:', parsedData)
            
            return {
                currentStep: "completed",
                loadedFile: filePath,
                loadedData: loadedData,
                parsedData: parsedData,
                exportedData: null,
                error: null
            }
        } catch (error) {
            console.error('❌ Workflow failed:', error)
            return {
                currentStep: "error",
                loadedFile: null,
                loadedData: null,
                parsedData: null,
                exportedData: null,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            }
        }
    }

    const exportWorkflow = async (workflowState: WorkflowState, options?: ExportOptions): Promise<any> => {
        if (!workflowState.parsedData) {
            throw new Error("No parsed data available for export")
        }
        
        try {
            console.log('🔄 Exporting workflow...', options)
            const result = await zkExport(workflowState.parsedData, options)
            console.log('✅ Workflow exported:', result)
            return result
        } catch (error) {
            console.error('❌ Export failed:', error)
            throw error
        }
    }

    return { processFile, exportWorkflow }
} 