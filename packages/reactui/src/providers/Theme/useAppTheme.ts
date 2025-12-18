import { useContext } from "react"
import { ThemeProviderContext } from "./ThemeProvider"

export function useAppTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider")
  }

  return {
    theme: context.theme,
    setTheme: context.setTheme,
    availableThemes: context.availableThemes
  }
}


