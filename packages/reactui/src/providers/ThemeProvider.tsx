import { createContext, useEffect, useState } from "react"
import { themes, type Theme } from "../lib/themes"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  availableThemes: Theme[]
}

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
  availableThemes: Object.keys(themes) as Theme[]
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "default",
  storageKey = "app-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey)
      if (stored && stored in themes) {
        return stored as Theme
      }
    }
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all existing theme attributes
    root.removeAttribute("data-theme")
    root.classList.remove("dark")
    
    // Apply the selected theme
    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme !== "default") {
      root.setAttribute("data-theme", theme)
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
    },
    availableThemes: Object.keys(themes) as Theme[]
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// Export the context for use in the hook
export { ThemeProviderContext } 