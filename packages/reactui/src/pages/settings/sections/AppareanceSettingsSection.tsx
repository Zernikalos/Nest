import { useAppTheme } from "@/hooks/useAppTheme"
import { useAppFont } from "@/hooks/useAppFont"
import { getThemeInfo, type Theme } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { MdPalette, MdFontDownload } from "react-icons/md"
import { SettingsMainContainer } from "../SettingsMainContainer"
import { SettingsSectionItem } from "../SettingsSectionItem"

// Appearance Settings Section
export function AppearanceSettingsSection() {
    const { theme, setTheme, availableThemes } = useAppTheme()
    const { font, setFont, availableFonts } = useAppFont()
  
    return (
      <SettingsMainContainer
        title="Appearance"
        description="Customize the look and feel of your application"
      >

        {/* Font Selection */}
        <SettingsSectionItem
          title="Font"
          description="Choose your preferred font family"
          icon={<MdFontDownload className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Family</label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((fontKey) => (
                    <SelectItem key={fontKey} value={fontKey}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: fontKey === 'system-ui' ? 'system-ui' : fontKey }}>
                          {fontKey}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The font will be applied immediately and saved for your next visit
              </p>
            </div>
          </div>
        </SettingsSectionItem>

        {/* Theme Selection */}
        <SettingsSectionItem
          title="Theme"
          description="Choose your preferred color scheme and theme"
          icon={<MdPalette className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((themeKey) => {
                    const themeInfo = getThemeInfo(themeKey as Theme)
                    return (
                      <SelectItem key={themeKey} value={themeKey}>
                        <div className="flex items-center gap-2">
                          <span>{themeInfo.icon}</span>
                          <span>{themeInfo.name}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The theme will be applied immediately and saved for your next visit
              </p>
            </div>
          </div>
        </SettingsSectionItem>

        {/* Theme Preview */}
        <SettingsSectionItem
          title="Theme Preview"
          description="See how your selected theme looks"
        >
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
        </SettingsSectionItem>
      </SettingsMainContainer>
    )
  }