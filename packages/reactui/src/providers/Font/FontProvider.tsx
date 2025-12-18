import { createContext, useEffect } from "react"
import { type Font } from "../../types/font"
import { useSettingsQuery, useUpdateSettingsMutation } from "../../hooks/useSettingsApi"

type FontProviderProps = {
  children: React.ReactNode
  defaultFont?: Font
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
  ...props
}: FontProviderProps) {
  const { data: settings } = useSettingsQuery()
  const updateSettingsMutation = useUpdateSettingsMutation()
  const font = (settings?.font && availableFonts.includes(settings.font as Font))
    ? (settings.font as Font)
    : defaultFont

  // Apply font to DOM
  useEffect(() => {
    document.body.style.fontFamily = getFontFamilyString(font)
  }, [font])

  const setFont = (newFont: Font) => {
    updateSettingsMutation.mutate({ font: newFont })
  }

  const value = {
    font,
    setFont,
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
