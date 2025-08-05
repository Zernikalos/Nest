"use client"

import { useAppTheme } from "@/hooks/useAppTheme"
import { Button } from "@/components/ui/button"
import { ThemeSelector, ThemeGrid, ThemeDropdown } from "./ThemeSelector"

export function ThemeExample() {
  // Get current theme state
  const themeState = useAppTheme()
  
  // Check if themeState is a function (when called with a theme name) or an object
  const isThemeFunction = typeof themeState === 'function'
  
  // If it's a function, we need to get the state separately
  const { theme, setTheme, availableThemes } = isThemeFunction 
    ? useAppTheme() as { theme: string; setTheme: (theme: string) => void; availableThemes: string[] }
    : themeState as { theme: string; setTheme: (theme: string) => void; availableThemes: string[] }
  
  // Get specific theme setters
  const setOceanTheme = useAppTheme('ocean') as () => void
  const setForestTheme = useAppTheme('forest') as () => void
  const setSunsetTheme = useAppTheme('sunset') as () => void
  const setPurpleTheme = useAppTheme('purple') as () => void
  const setRoseTheme = useAppTheme('rose') as () => void

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Theme System Examples</h2>
        
        {/* Current theme display */}
        <div className="p-4 bg-card border rounded-lg">
          <h3 className="font-semibold mb-2">Current Theme: {theme}</h3>
          <p className="text-muted-foreground">
            Available themes: {availableThemes.join(', ')}
          </p>
        </div>

        {/* Method 1: Direct theme setters */}
        <div className="space-y-2">
          <h3 className="font-semibold">Method 1: Direct Theme Setters</h3>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={setOceanTheme} variant="outline">
              🌊 Ocean
            </Button>
            <Button onClick={setForestTheme} variant="outline">
              🌲 Forest
            </Button>
            <Button onClick={setSunsetTheme} variant="outline">
              🌅 Sunset
            </Button>
            <Button onClick={setPurpleTheme} variant="outline">
              👑 Purple
            </Button>
            <Button onClick={setRoseTheme} variant="outline">
              🌹 Rose
            </Button>
          </div>
        </div>

        {/* Method 2: Using setTheme directly */}
        <div className="space-y-2">
          <h3 className="font-semibold">Method 2: Using setTheme</h3>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setTheme('default')} variant="outline">
              ☀️ Default
            </Button>
            <Button onClick={() => setTheme('dark')} variant="outline">
              🌙 Dark
            </Button>
            <Button onClick={() => setTheme('ocean')} variant="outline">
              🌊 Ocean
            </Button>
          </div>
        </div>

        {/* Theme Selectors */}
        <div className="space-y-4">
          <h3 className="font-semibold">Theme Selectors</h3>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Dropdown Selector:</h4>
            <ThemeSelector />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Grid Selector:</h4>
            <ThemeGrid />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Icon Dropdown:</h4>
            <ThemeDropdown />
          </div>
        </div>

        {/* Theme preview */}
        <div className="space-y-2">
          <h3 className="font-semibold">Theme Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border rounded-lg">
              <h4 className="font-medium mb-2">Card Example</h4>
              <p className="text-muted-foreground mb-3">
                This card shows how the theme affects different elements.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
              </div>
            </div>
            
            <div className="p-4 bg-muted border rounded-lg">
              <h4 className="font-medium mb-2">Muted Card</h4>
              <p className="text-muted-foreground">
                This shows the muted background and text colors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 