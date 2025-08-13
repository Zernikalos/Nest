import React, { createContext, useContext } from 'react'
import { useFileImportWorkflow } from '../hooks/useFileImportWorkflow'
import type { ZkConvertResult } from '@zernikalos/zkbuilder'

interface FileImportContextType {
    isImporting: boolean
    importError: string | null
    currentFile: { path: string; fileName: string; format: any } | null
    zkResult: ZkConvertResult | null
    cancelImport: () => void
}

const FileImportContext = createContext<FileImportContextType | null>(null)

export function FileImportProvider({ children }: { children: React.ReactNode }) {
    const fileImportWorkflow = useFileImportWorkflow()
    
    return (
        <FileImportContext.Provider value={fileImportWorkflow}>
            {children}
        </FileImportContext.Provider>
    )
}

export function useFileImport() {
    const context = useContext(FileImportContext)
    if (!context) {
        throw new Error('useFileImport must be used within a FileImportProvider')
    }
    return context
} 