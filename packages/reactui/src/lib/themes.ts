// Define the theme structure interface
interface ThemeInfo {
  name: string
  value: string
  description: string
  isDarkTheme: boolean
}

// Define the themes object with proper typing
export const themes: Record<string, ThemeInfo> = {
  default: {
    name: "Light",
    value: "light",
    description: "Classic light theme",
    isDarkTheme: false
  },
  dark: {
    name: "Dark",
    value: "dark", 
    description: "Dark mode theme",
    isDarkTheme: true
  },
  ocean: {
    name: "Ocean",
    value: "ocean",
    description: "Deep blue ocean theme",
    isDarkTheme: true
  },
  forest: {
    name: "Forest",
    value: "forest",
    description: "Natural green theme",
    isDarkTheme: true
  },
  sunset: {
    name: "Sunset",
    value: "sunset",
    description: "Warm orange theme",
    isDarkTheme: true
  },
  purple: {
    name: "Purple",
    value: "purple",
    description: "Royal purple theme",
    isDarkTheme: true
  },
  rose: {
    name: "Rose",
    value: "rose",
    description: "Pink/rose theme",
    isDarkTheme: true
  },
  gray: {
    name: "Gray",
    value: "gray",
    description: "Dark gray theme",
    isDarkTheme: true
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

// New helper function to check if a theme is dark
export const isDarkTheme = (theme: Theme): boolean => themes[theme].isDarkTheme

// Type-safe theme validation
export const isValidTheme = (theme: string): theme is Theme => {
  return theme in themes
} 