import { useContext } from "react"
import { FontProviderContext } from "./FontProvider"
import { type Font } from "../../types/font"

export type { Font }

export function useAppFont() {
  const context = useContext(FontProviderContext)

  if (context === undefined) {
    throw new Error("useAppFont must be used within a FontProvider")
  }

  return {
    font: context.font,
    setFont: context.setFont,
    availableFonts: context.availableFonts
  }
}


