import { type ReactNode } from "react"
import { ThemeProvider } from "./ThemeProvider"
import { FontProvider } from "./FontProvider"
import { type Font } from "../types/font"
import { type Theme } from "../lib/themes"

type AppearanceProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  defaultFont?: Font
}

export function AppearanceProvider({ 
  children, 
  defaultTheme = "default", 
  defaultFont = "Rajdhani" 
}: AppearanceProviderProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <FontProvider defaultFont={defaultFont}>
        {children}
      </FontProvider>
    </ThemeProvider>
  )
} 