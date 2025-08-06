import { useState, useCallback } from "react"
import { zkParse } from "@zernikalos/zkbuilder"
import type { ParseOptions, ZkoParsed, ZkoParseableObject } from "@zernikalos/zkbuilder"

interface UseZkParseState {
    data: ZkoParsed | null
    loading: boolean
    error: string | null
}

interface UseZkParseReturn extends UseZkParseState {
    parseObject: (parseableObject: ZkoParseableObject, options?: ParseOptions) => Promise<ZkoParsed>
    reset: () => void
}

export function useZkParse(): UseZkParseReturn {
    const [state, setState] = useState<UseZkParseState>({
        data: null,
        loading: false,
        error: null
    })

    const parseObject = useCallback(async (parseableObject: ZkoParseableObject, options?: ParseOptions): Promise<ZkoParsed> => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        try {
            const result = await zkParse(parseableObject, options)
            setState({
                data: result,
                loading: false,
                error: null
            })
            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            setState({
                data: null,
                loading: false,
                error: errorMessage
            })
            throw new Error(errorMessage)
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