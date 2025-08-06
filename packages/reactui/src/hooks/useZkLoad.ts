import { useState, useCallback } from "react"
import { zkLoad } from "@zernikalos/zkbuilder"
import type { LoadOptions, InputFileFormat, ZkoParseableObject } from "@zernikalos/zkbuilder"

interface UseZkLoadState {
    data: ZkoParseableObject | null
    loading: boolean
    error: string | null
}

interface UseZkLoadReturn extends UseZkLoadState {
    loadFile: (filePath: string, format?: InputFileFormat) => Promise<void>
    reset: () => void
}

export function useZkLoad(): UseZkLoadReturn {
    const [state, setState] = useState<UseZkLoadState>({
        data: null,
        loading: false,
        error: null
    })

    const loadFile = useCallback(async (filePath: string, format?: InputFileFormat) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        try {
            const options: LoadOptions = {
                filePath,
                format
            }
            
            const result = await zkLoad(options)
            setState({
                data: result,
                loading: false,
                error: null
            })
        } catch (error) {
            setState({
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            })
        }
    }, [])

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null
        })
    }, [])

    return {
        ...state,
        loadFile,
        reset
    }
} 