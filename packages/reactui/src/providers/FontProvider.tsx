import { createContext, useEffect } from "react"
import { type Font } from "../types/font"
import { usePersistentState } from "../hooks/usePersistentState"

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
  const [font, setFont] = usePersistentState<Font>(
    storageKey,
    defaultFont,
    (value): value is Font => availableFonts.includes(value)
  )

  useEffect(() => {
    // Apply the selected font to the document body
    document.body.style.fontFamily = getFontFamilyString(font)
  }, [font])

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