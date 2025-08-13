import { useContext } from "react"
import { ThemeProviderContext } from "./ThemeProvider"
import { type Theme } from "../../lib/themes"

// Function overloads for better type safety
export function useAppTheme(): {
  theme: Theme
  setTheme: (theme: Theme) => void
  availableThemes: Theme[]
}

export function useAppTheme(themeName: Theme): () => void

export function useAppTheme(themeName?: Theme) {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider")
  }

  // If a theme name is provided, return a function to set that specific theme
  if (themeName) {
    return () => context.setTheme(themeName)
  }

  // Otherwise return the current theme state and setter
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    availableThemes: context.availableThemes
  }
}


