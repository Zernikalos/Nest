import { useState, useEffect } from "react"

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  validator?: (value: any) => value is T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue
    }
    
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (validator) {
          return validator(parsed) ? parsed : defaultValue
        }
        return parsed
      }
    } catch (error) {
      console.warn(`Failed to load state for key "${key}":`, error)
    }
    
    return defaultValue
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch (error) {
        console.warn(`Failed to save state for key "${key}":`, error)
      }
    }
  }, [state, key])

  return [state, setState]
} 