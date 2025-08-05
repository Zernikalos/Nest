import { createContext, useEffect, useState } from "react"
import { type Font } from "../types/font"

type FontProviderProps = {
  children: React.ReactNode
  defaultFont?: Font
  storageKey?: string
}

type FontProviderState = {
  font: Font
  setFont: (font: Font) => void
  availableFonts: Font[]
}

const availableFonts: Font[] = [
  "system-ui",
  "Menlo",
  "Fira Code",
  "JetBrains Mono",
  "Source Code Pro",
  "Roboto",
  "Open Sans",
  "Lato",
  "Verdana",
  "Rajdhani"
]

// Helper to generate the font-family string
const getFontFamilyString = (fontName: Font): string => {
  const fontMap: { [key in Font]: string } = {
    'system-ui': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'Menlo': 'Menlo, Consolas, "Liberation Mono", Courier, monospace',
    'Fira Code': '"Fira Code", Consolas, "Liberation Mono", Courier, monospace',
    'JetBrains Mono': '"JetBrains Mono", Consolas, "Liberation Mono", Courier, monospace',
    'Source Code Pro': '"Source Code Pro", Consolas, "Liberation Mono", Courier, monospace',
    'Roboto': 'Roboto, sans-serif',
    'Open Sans': '"Open Sans", sans-serif',
    'Lato': 'Lato, sans-serif',
    'Verdana': 'Verdana, sans-serif',
    'Rajdhani': 'Rajdhani, sans-serif'
  }
  return fontMap[fontName]
}

const initialState: FontProviderState = {
  font: "Rajdhani",
  setFont: () => null,
  availableFonts
}

const FontProviderContext = createContext<FontProviderState>(initialState)

export function FontProvider({
  children,
  defaultFont = "Rajdhani",
  storageKey = "app-font",
  ...props
}: FontProviderProps) {
  const [font, setFont] = useState<Font>(() => {
    // Try to get font from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey)
      if (stored && availableFonts.includes(stored as Font)) {
        return stored as Font
      }
    }
    return defaultFont
  })

  useEffect(() => {
    // Apply the selected font to the document body
    document.body.style.fontFamily = getFontFamilyString(font)
    
    // Save to localStorage
    localStorage.setItem(storageKey, font)
  }, [font, storageKey])

  const value = {
    font,
    setFont: (newFont: Font) => {
      setFont(newFont)
    },
    availableFonts
  }

  return (
    <FontProviderContext.Provider {...props} value={value}>
      {children}
    </FontProviderContext.Provider>
  )
}

// Export the context for use in the hook
export { FontProviderContext } 