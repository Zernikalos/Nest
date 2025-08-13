import React, { createContext } from 'react'
import { useZkoConverter } from './useZkoConverter'
import type { ZkConvertResult } from '@zernikalos/zkbuilder'

interface ZkProjectContextType {
    // State
    isImporting: boolean
    importError: string | null
    
    // Main data - directly from zkConvert result
    zkResult: ZkConvertResult | null
    
    // Actions
    cleanProject: () => void
}

const ZkProjectContext = createContext<ZkProjectContextType | null>(null)

export function ZkProjectProvider({ children }: { children: React.ReactNode }) {
    const zkLogic = useZkoConverter()
    
    return (
        <ZkProjectContext.Provider value={zkLogic}>
            {children}
        </ZkProjectContext.Provider>
    )
}

// Export the context for use in the hook
export { ZkProjectContext }
