import { useAppTheme } from "@/providers/Theme"
import { themes } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

// Simple theme selector with dropdown
export function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useAppTheme()

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        {availableThemes.map((themeKey: string) => {
          const themeInfo = themes[themeKey as keyof typeof themes]
          return (
            <SelectItem key={themeKey} value={themeKey}>
              <div className="flex items-center gap-2">
                <span>{themeInfo.name}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

// Alternative: Grid of theme buttons
export function ThemeGrid() {
  const { theme, setTheme, availableThemes } = useAppTheme()

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableThemes.map((themeKey: string) => {
        const themeInfo = themes[themeKey as keyof typeof themes]
        const isActive = theme === themeKey
        
        return (
          <Button
            key={themeKey}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme(themeKey)}
            className="flex flex-col items-center gap-1 h-auto p-3"
          >
            <span className="text-xs">{themeInfo.name}</span>
          </Button>
        )
      })}
    </div>
  )
}

// Alternative: Dropdown menu style
export function ThemeDropdown() {  
  const { setTheme, availableThemes } = useAppTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableThemes.map((themeKey: string) => {
          const themeInfo = themes[themeKey as keyof typeof themes]
          return (
            <DropdownMenuItem
              key={themeKey}
              onClick={() => setTheme(themeKey)}
              className="flex items-center gap-2"
            >
              <span>{themeInfo.name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 