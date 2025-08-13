import { useContext } from 'react'
import { ZkProjectContext } from './ZkProjectProvider'

export function useZkProject() {
    const context = useContext(ZkProjectContext)
    
    if (!context) {
        throw new Error('useZkProject must be used within a ZkProjectProvider')
    }
    
    return context
}
