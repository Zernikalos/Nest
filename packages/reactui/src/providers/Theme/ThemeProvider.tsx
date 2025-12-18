import { createContext, useEffect } from "react"
import { themes, type Theme, isDarkTheme } from "../../lib/themes"
import { useSettingsQuery, useUpdateSettingsMutation } from "../../hooks/useSettingsApi"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
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
  ...props
}: ThemeProviderProps) {
  const { data: settings } = useSettingsQuery()
  const updateSettingsMutation = useUpdateSettingsMutation()
  const theme = (settings?.theme && settings.theme in themes)
    ? (settings.theme as Theme)
    : defaultTheme

  // Apply theme to DOM
  useEffect(() => {
    const root = window.document.documentElement
    
    root.removeAttribute("data-theme")
    root.classList.remove("dark")
    
    if (theme !== "default") {
      root.setAttribute("data-theme", theme)
      if (isDarkTheme(theme)) {
        root.classList.add("dark")
      }
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    updateSettingsMutation.mutate({ theme: newTheme })
  }

  const value = {
    theme,
    setTheme,
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
