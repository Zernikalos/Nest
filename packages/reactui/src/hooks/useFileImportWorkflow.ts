import { useCallback, useEffect, useState } from 'react'
import { useElectronEvents } from './useElectronEvents'
import { useFileApi } from './useFileApi'
import { useZkWorkflow, type WorkflowState } from './useZkWorkflow'
import type { InputFileFormat, ZkoParsed } from '@zernikalos/zkbuilder'

interface FileImportData {
    path: string
    fileName: string
    format: InputFileFormat
}

interface UseFileImportWorkflowReturn {
    // State
    isImporting: boolean
    importError: string | null
    currentFile: FileImportData | null
    
    // Main data
    parsedData: ZkoParsed | null
    exportedData: any | null
    
    // Actions
    startFileImport: () => void
    cancelImport: () => void
    
    // Workflow functions
    workflow: ReturnType<typeof useZkWorkflow>
}

export function useFileImportWorkflow(): UseFileImportWorkflowReturn {
    const [isImporting, setIsImporting] = useState(false)
    const [importError, setImportError] = useState<string | null>(null)
    const [currentFile, setCurrentFile] = useState<FileImportData | null>(null)
    const [workflowState, setWorkflowState] = useState<WorkflowState>({
        currentStep: "idle",
        loadedFile: null,
        loadedData: null,
        parsedData: null,
        exportedData: null,
        error: null
    })
    
    const { onImportFile, isElectron } = useElectronEvents()
    const { getFileUrl, isLoading: isFileApiLoading, error: fileApiError } = useFileApi()
    const workflow = useZkWorkflow()
    
    // Handle file import from Electron
    const handleFileImport = useCallback(async (data: FileImportData) => {
        if (!isElectron) {
            setImportError("File import only available in Electron environment")
            return
        }
        
        setIsImporting(true)
        setImportError(null)
        setCurrentFile(data)
        
        try {
            console.log('📁 Starting file import:', data)
            
            // Step 1: Get file URL from backend
            console.log('🔄 Getting file URL from backend...')
            const fileUrl = await getFileUrl({
                path: data.path,
                fileName: data.fileName
            })
            console.log('✅ File URL obtained:', fileUrl)
            
            // Step 2: Process file through ZK workflow
            console.log('🔄 Processing file through ZK workflow...')
            const result = await workflow.processFile(fileUrl, data.format)
            setWorkflowState(result)
            console.log('✅ File processed successfully')
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            console.error('❌ File import failed:', errorMessage)
            setImportError(errorMessage)
        } finally {
            setIsImporting(false)
        }
    }, [isElectron, getFileUrl, workflow.processFile])
    
    // Setup Electron event listener - useElectronEvents already handles registration tracking
    useEffect(() => {
        if (isElectron) {
            console.log('🔄 Registering file import callback with Electron...')
            onImportFile(handleFileImport)
            console.log('✅ File import callback registered successfully')
        }
    }, [isElectron, onImportFile, handleFileImport])
    
    // Handle file API errors
    useEffect(() => {
        if (fileApiError) {
            setImportError(fileApiError.message)
        }
    }, [fileApiError])
    
    const startFileImport = useCallback(() => {
        if (!isElectron) {
            setImportError("File import only available in Electron environment")
            return
        }
        
        // This will trigger the Electron dialog
        // The actual import will be handled by the callback
        onImportFile(handleFileImport)
    }, [isElectron, onImportFile, handleFileImport])
    
    const cancelImport = useCallback(() => {
        setIsImporting(false)
        setImportError(null)
        setCurrentFile(null)
        setWorkflowState({
            currentStep: "idle",
            loadedFile: null,
            loadedData: null,
            parsedData: null,
            exportedData: null,
            error: null
        })
    }, [])
    
    return {
        isImporting: isImporting || isFileApiLoading || workflowState.currentStep !== "idle",
        importError: importError || workflowState.error,
        currentFile,
        parsedData: workflowState.parsedData,
        exportedData: workflowState.exportedData,
        startFileImport,
        cancelImport,
        workflow
    }
}