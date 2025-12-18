import { create } from 'zustand'
import type { ZkResultExtended } from '@/types/project'

interface ZkoState {
    isConverting: boolean
    conversionError: string | null
    zkResult: ZkResultExtended | null
}

interface ZkoActions {
    setConverting: (converting: boolean) => void
    setError: (error: string | null) => void
    setZkResult: (result: ZkResultExtended | null) => void
    clearZko: () => void
}

export const useZkoStore = create<ZkoState & ZkoActions>((set) => ({
    isConverting: false,
    conversionError: null,
    zkResult: null,
    
    setConverting: (converting) => set({ isConverting: converting }),
    setError: (error) => set({ conversionError: error }),
    setZkResult: (result) => set({ zkResult: result }),
    clearZko: () => set({ 
        isConverting: false, 
        conversionError: null, 
        zkResult: null 
    }),
}))

