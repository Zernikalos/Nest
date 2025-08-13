import { useCallback, useEffect, useState } from 'react'
import { useElectronEvents } from '@/providers/Electron'
import { getFileUrl } from '@/lib/fileApi'
import { zkConvert, type ZkConvertResult, type InputFileFormat } from '@zernikalos/zkbuilder'

interface FileImportData {
    path: string
    fileName: string
    format: InputFileFormat
}

export function useZkoConverter() {
    const [isImporting, setIsImporting] = useState(false)
    const [importError, setImportError] = useState<string | null>(null)
    const [zkResult, setZkResult] = useState<ZkConvertResult | null>(null)
    
    const { onImportFile, offImportFile, isElectron } = useElectronEvents()
    
    // Handle file import from Electron
    const handleFileImport = useCallback(async (data: FileImportData) => {
        if (!isElectron) {
            setImportError("File import only available in Electron environment")
            return
        }
        
        setIsImporting(true)
        setImportError(null)
        
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
            const result = await zkConvert({filePath: fileUrl, format: data.format}, {exportOptions: {format: "object"}})
            setZkResult(result)
            console.log('✅ File processed successfully')
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            console.error('❌ File import failed:', errorMessage)
            setImportError(errorMessage)
        } finally {
            setIsImporting(false)
        }
    }, [isElectron])
    
    // Setup Electron event listener with cleanup
    useEffect(() => {
        if (isElectron) {
            onImportFile(handleFileImport)
            console.log('✅ File import callback registered successfully')
            
            // Cleanup when component unmounts
            return () => {
                offImportFile()
            }
        }
    }, [isElectron, onImportFile, offImportFile, handleFileImport])
    
    // Clean project function - reset to initial state
    const cleanProject = useCallback(() => {
        setIsImporting(false)
        setImportError(null)
        setZkResult(null)
        console.log('🧹 Project cleaned - reset to initial state')
    }, [])
    
    return {
        isImporting,
        importError,
        zkResult,
        cleanProject,
    }
}
