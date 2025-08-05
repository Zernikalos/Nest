// Define the theme structure interface
interface ThemeInfo {
  name: string
  value: string
  description: string
  icon: string
}

// Define the themes object with proper typing
export const themes: Record<string, ThemeInfo> = {
  default: {
    name: "Default",
    value: "default",
    description: "Classic light theme",
    icon: "☀️"
  },
  dark: {
    name: "Dark",
    value: "dark", 
    description: "Dark mode theme",
    icon: "🌙"
  },
  ocean: {
    name: "Ocean",
    value: "ocean",
    description: "Deep blue ocean theme",
    icon: "🌊"
  },
  forest: {
    name: "Forest",
    value: "forest",
    description: "Natural green theme",
    icon: "🌲"
  },
  sunset: {
    name: "Sunset",
    value: "sunset",
    description: "Warm orange theme",
    icon: "🌅"
  },
  purple: {
    name: "Purple",
    value: "purple",
    description: "Royal purple theme",
    icon: "👑"
  },
  rose: {
    name: "Rose",
    value: "rose",
    description: "Pink/rose theme",
    icon: "🌹"
  }
} as const

// Create proper types from the const assertion
export type Theme = keyof typeof themes
export type ThemeValue = typeof themes[Theme]['value']
export type ThemeInfoType = typeof themes[Theme]

// Helper functions with proper typing
export const getThemeNames = (): Theme[] => Object.keys(themes) as Theme[]
export const getThemeValues = (): ThemeValue[] => Object.values(themes).map(theme => theme.value)
export const getThemeInfo = (theme: Theme): ThemeInfoType => themes[theme]

// Type-safe theme validation
export const isValidTheme = (theme: string): theme is Theme => {
  return theme in themes
} 