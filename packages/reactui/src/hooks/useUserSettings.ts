import { useCallback } from 'react'

const isElectron = typeof window !== 'undefined' && window.userSettings

export const useUserSettings = () => {
    const getSetting = useCallback(async (key: string) => {
        if (isElectron) {
            return await window.userSettings?.get(key)
        }
        return null
    }, [])

    const setSetting = useCallback(async (key: string, value: any) => {
        if (isElectron) {
            await window.userSettings?.set(key, value)
        }
    }, [])

    return {
        getSetting,
        setSetting,
        isElectron
    }
} 