import React, { useEffect } from 'react'
import { useElectronEvents } from '@/providers/Electron'
import { useZkProjectStore } from '@/stores'

export function ZkProjectProvider({ children }: { children: React.ReactNode }) {
    const { onImportFile, offImportFile, isElectron } = useElectronEvents()
    const { handleFileImport, setError } = useZkProjectStore()
    
    // Setup Electron event listener with cleanup
    useEffect(() => {
        if (isElectron) {
            onImportFile(handleFileImport)
            console.log('✅ File import callback registered successfully')
            
            // Cleanup when component unmounts
            return () => {
                offImportFile()
            }
        } else {
            // Set error if not in Electron environment
            setError("File import only available in Electron environment")
        }
    }, [isElectron, onImportFile, offImportFile, handleFileImport, setError])
    
    return <>{children}</>
}
