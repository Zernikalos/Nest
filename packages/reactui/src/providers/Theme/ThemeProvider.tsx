import { createContext, useEffect } from "react"
import { themes, type Theme, isDarkTheme } from "../../lib/themes"
import { usePersistentState } from "../../hooks/usePersistentState"

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
  const [theme, setTheme] = usePersistentState<Theme>(
    storageKey,
    defaultTheme,
    (value): value is Theme => value in themes
  )

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all existing theme attributes
    root.removeAttribute("data-theme")
    root.classList.remove("dark")
    
    // Apply the selected theme
    if (theme !== "default") {
      root.setAttribute("data-theme", theme)
      
      // Check if it's a dark theme using the theme definition
      if (isDarkTheme(theme)) {
        root.classList.add("dark")
      }
    }
  }, [theme])

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


