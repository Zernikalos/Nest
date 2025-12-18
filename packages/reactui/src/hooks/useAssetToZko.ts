import { useCallback } from 'react'
import { useZkoStore } from '@/stores/useZkoStore'
import { useProject } from './useProject'
import { getFileUrl } from '@/lib/fileApi'
import { zkConvert, zkExport } from '@zernikalos/zkbuilder'
import type { AssetConversionData, ZkResultExtended } from '@/types/project'
import { regenerateZko as regenerateZkoUtil } from '@/types/project'
import _ from 'lodash'

export function useAssetToZko() {
    const { isConverting, conversionError, zkResult, setConverting, setError, setZkResult, clearZko } = useZkoStore()
    const { addAssetToProject, isProjectOpen } = useProject()
    
    const convertAssetToZko = useCallback(async (data: AssetConversionData) => {
        setConverting(true)
        setError(null)
        
        try {
            console.log('📁 Starting asset conversion to ZKO:', data)
            
            // Step 1: Get file URL
            console.log('🔄 Getting file URL from backend...')
            const fileUrl = await getFileUrl({
                path: data.path,
                fileName: data.fileName
            })
            console.log('✅ File URL obtained:', fileUrl)
            
            // Step 2: Convert asset to ZKO
            console.log('🔄 Converting asset to ZKO format...')
            const result = await zkConvert(
                { filePath: fileUrl, format: data.format }, 
                { exportOptions: { format: "object" } }
            )
            const proto = await zkExport(result.zko, { format: "proto" }) as Uint8Array
            const extendedResult: ZkResultExtended = { ...result, proto }
            
            setZkResult(extendedResult)
            console.log('✅ Asset converted to ZKO successfully')
            
            // Step 3: Save asset to project if project is open
            if (isProjectOpen) {
                try {
                    await addAssetToProject({
                        path: data.path,
                        fileName: data.fileName,
                        format: data.format,
                    })
                } catch (assetError) {
                    console.warn('Failed to save asset to project:', assetError)
                    // Don't fail the conversion if saving asset fails
                }
            }
            
            return extendedResult
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            console.error('❌ Asset conversion to ZKO failed:', errorMessage)
            setError(errorMessage)
            throw error
        } finally {
            setConverting(false)
        }
    }, [setConverting, setError, setZkResult, isProjectOpen, addAssetToProject])
    
    const regenerateZko = useCallback(async () => {
        // Get zkResult from store when function executes, not from closure
        // This makes the function stable and prevents infinite loops
        const currentZkResult = useZkoStore.getState().zkResult;
        
        if (_.isNil(currentZkResult)) {
            return
        }
        
        try {
            const regeneratedResult = await regenerateZkoUtil(currentZkResult)
            setZkResult(regeneratedResult)
            console.log('✅ ZKO regenerated successfully')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to regenerate ZKO"
            console.error('❌ Regeneration failed:', errorMessage)
            setError(errorMessage)
        }
    }, [setZkResult, setError])
    
    return {
        // State
        isConverting,
        conversionError,
        zkResult,
        
        // Actions
        convertAssetToZko,
        clearZko,
        regenerateZko,
    }
}

