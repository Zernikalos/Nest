export const themes = {
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

export type Theme = keyof typeof themes
export type ThemeValue = typeof themes[Theme]['value']

export const getThemeNames = () => Object.keys(themes) as Theme[]
export const getThemeValues = () => Object.values(themes).map(theme => theme.value) 