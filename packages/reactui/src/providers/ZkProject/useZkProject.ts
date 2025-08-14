import { useZkProjectStore } from '@/stores'

export function useZkProject() {
    const { 
        isImporting, 
        importError, 
        zkResult, 
        cleanProject 
    } = useZkProjectStore()
    
    return {
        isImporting,
        importError,
        zkResult,
        cleanProject,
    }
}
