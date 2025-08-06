import { useState, useCallback } from "react"
import { zkParse } from "@zernikalos/zkbuilder"
import type { ParseOptions, ZkoParsed, ZkoParseableObject } from "@zernikalos/zkbuilder"

interface UseZkParseState {
    data: ZkoParsed | null
    loading: boolean
    error: string | null
}

interface UseZkParseReturn extends UseZkParseState {
    parseObject: (parseableObject: ZkoParseableObject, options?: ParseOptions) => Promise<void>
    reset: () => void
}

export function useZkParse(): UseZkParseReturn {
    const [state, setState] = useState<UseZkParseState>({
        data: null,
        loading: false,
        error: null
    })

    const parseObject = useCallback(async (parseableObject: ZkoParseableObject, options?: ParseOptions) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        try {
            const result = await zkParse(parseableObject, options)
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
        parseObject,
        reset
    }
} 