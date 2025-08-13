import { useContext } from "react"
import { FontProviderContext } from "./FontProvider"
import { type Font } from "../../types/font"

export type { Font }

// Function overloads for better type safety
export function useAppFont(): {
  font: Font
  setFont: (font: Font) => void
  availableFonts: Font[]
}

export function useAppFont(fontName: Font): () => void

export function useAppFont(fontName?: Font) {
  const context = useContext(FontProviderContext)

  if (context === undefined) {
    throw new Error("useAppFont must be used within a FontProvider")
  }

  // If a font name is provided, return a function to set that specific font
  if (fontName) {
    return () => context.setFont(fontName)
  }

  // Otherwise return the current font state and setter
  return {
    font: context.font,
    setFont: context.setFont,
    availableFonts: context.availableFonts
  }
}


