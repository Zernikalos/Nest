import { create } from 'zustand'
import { getFileUrl } from '@/lib/fileApi'
import { zkConvert, type ZkConvertResult, type InputFileFormat, zkExport } from '@zernikalos/zkbuilder'
import _ from 'lodash'

interface FileImportData {
    path: string
    fileName: string
    format: InputFileFormat
}

export interface ZkResultExtended extends ZkConvertResult {
    proto: Uint8Array
}

interface ZkProjectState {
    // State
    isImporting: boolean
    importError: string | null
    zkResult: ZkResultExtended | null
    
    // Actions
    setImporting: (importing: boolean) => void
    setError: (error: string | null) => void
    setZkResult: (result: ZkResultExtended | null) => void
    cleanProject: () => void
    handleFileImport: (data: FileImportData) => Promise<void>
    bundleScene: () => Promise<Uint8Array | undefined>
    handleBundleScene: () => Promise<void>
}

export const useZkProjectStore = create<ZkProjectState>((set, get) => ({
    // Initial state
    isImporting: false,
    importError: null,
    zkResult: null,
    
    // Actions
    setImporting: (importing) => set({ isImporting: importing }),
    setError: (error) => set({ importError: error }),
    setZkResult: (result: ZkResultExtended | null) => set({ zkResult: result }),
    
    cleanProject: () => {
        set({
            isImporting: false,
            importError: null,
            zkResult: null
        })
        console.log('🧹 Project cleaned - reset to initial state')
    },
    
    handleFileImport: async (data: FileImportData) => {
        const { setImporting, setError, setZkResult } = get()
        
        setImporting(true)
        setError(null)
        
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
            const proto = await zkExport(result.zko, {format: "proto"}) as Uint8Array
            setZkResult({...result, proto})
            console.log('✅ File processed successfully')
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            console.error('❌ File import failed:', errorMessage)
            setError(errorMessage)
        } finally {
            setImporting(false)
        }
    },

    bundleScene: async () => {
        const { zkResult } = get()
        if (_.isNil(zkResult)) {
            return
        }
        const parsedData = zkResult.zko
        return await zkExport(parsedData, {format: "proto"}) as Uint8Array
    },

    handleBundleScene: async () => {
        const bundledAsProto = await get().bundleScene()
        if (_.isNil(bundledAsProto)) {
            return
        }
        window.NativeZernikalos?.actionSaveFile(bundledAsProto)
    }
}))
