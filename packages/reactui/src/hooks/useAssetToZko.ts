import { useCallback, useMemo } from 'react'
import { useZkoStore } from '@/stores/useZkoStore'
import { useProject } from './useProject'
import type { AssetConversionData } from '@/types/project'
import { ZkoManager } from '@/core/ZkoManager'

export function useAssetToZko() {
    // Use singleton instance of ZkoManager
    const manager = useMemo(() => {
        return ZkoManager.getInstance()
    }, [])

    const { isConverting, conversionError, zkResult, setConverting, setError, setZkResult, clearZko } = useZkoStore()
    const { addAssetToProject, isProjectOpen } = useProject()
    
    const convertAssetToZko = useCallback(async (data: AssetConversionData) => {
        try {
            console.log('📁 Starting asset conversion to ZKO:', data)
            
            // Update UI state: start converting
            setConverting(true)
            setError(null)
            
            // Use manager to convert asset
            const extendedResult = await manager.convertAssetToZko(data)
            console.log('✅ Asset converted to ZKO successfully')
            
            // Update UI state: conversion complete
            setZkResult(extendedResult)
            setConverting(false)
            
            // Step 3: Save asset to project if project is open
            if (isProjectOpen) {
                try {
                    await addAssetToProject({
                        path: data.path,
                        fileName: data.fileName,
                        format: data.format,
                    })
                    console.log('✅ Asset saved to project')
                } catch (assetError) {
                    console.warn('Failed to save asset to project:', assetError)
                    // Don't fail the conversion if saving asset fails
                }
            }
            
            return extendedResult
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            console.error('❌ Asset conversion to ZKO failed:', errorMessage)
            
            // Update UI state: error
            setError(errorMessage)
            setConverting(false)
            
            throw error
        }
    }, [manager, isProjectOpen, addAssetToProject, setConverting, setError, setZkResult])
    
    const regenerateZko = useCallback(async () => {
        if (!zkResult) {
            throw new Error('No ZKO result available')
        }

        try {
            setConverting(true)
            setError(null)
            
            const regeneratedResult = await manager.regenerateZko(zkResult)
            console.log('✅ ZKO regenerated successfully')
            
            setZkResult(regeneratedResult)
            setConverting(false)
            
            return regeneratedResult
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to regenerate ZKO"
            console.error('❌ Regeneration failed:', errorMessage)
            
            setError(errorMessage)
            setConverting(false)
            
            throw error
        }
    }, [manager, zkResult, setConverting, setError, setZkResult])
    
    const clearZkoCallback = useCallback(() => {
        clearZko()
    }, [clearZko])
    
    return {
        // State from Zustand store
        isConverting,
        conversionError,
        zkResult,
        
        // Actions
        convertAssetToZko,
        clearZko: clearZkoCallback,
        regenerateZko,
    }
}

