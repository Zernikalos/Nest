import { useAppTheme } from "@/providers/Theme"
import { useAppFont } from "@/providers/Font"
import { getThemeInfo, type Theme } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { MdPalette, MdFontDownload } from "react-icons/md"
import { SettingsMainContainer } from "../SettingsMainContainer"
import { SettingsSectionItem } from "../SettingsSectionItem"
import { SettingsFieldSelect, SettingsFieldGeneric } from "../SettingsField"

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
          <SettingsFieldSelect
            title="Font Family"
            description="The font will be applied immediately and saved for your next visit"
            value={font}
            onValueChange={(value) => setFont(value as any)}
            options={availableFonts.map((fontKey) => ({
              value: fontKey,
              label: fontKey
            }))}
            placeholder="Select a font"
          />
        </SettingsSectionItem>

        {/* Theme Selection */}
        <SettingsSectionItem
          title="Theme"
          description="Choose your preferred color scheme and theme"
          icon={<MdPalette className="h-5 w-5" />}
        >
          <SettingsFieldSelect
            title="Theme"
            description="The theme will be applied immediately and saved for your next visit"
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
            options={availableThemes.map((themeKey) => {
              const themeInfo = getThemeInfo(themeKey as Theme)
              return {
                value: themeKey,
                label: themeInfo.name
              }
            })}
            placeholder="Select a theme"
          />

          <SettingsFieldGeneric
            title="Theme Preview"
            description="See how your selected theme looks"
            layout="vertical"
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

          </SettingsFieldGeneric>
        </SettingsSectionItem>

      </SettingsMainContainer>
    )
  }