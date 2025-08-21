import { useAppTheme } from "@/providers/Theme"
import { useAppFont } from "@/providers/Font"
import { getThemeInfo, type Theme } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { MdPalette, MdFontDownload } from "react-icons/md"
import { SettingsMainContainer, SettingsSectionItem } from "@/pages/settings/components/layout"
import { ControlledSettingsFieldSelect, SettingsFieldGeneric } from "@/pages/settings/components/fields"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

type AppearanceFormData = {
    font: string
    theme: string
}

// Component to handle real-time updates
function AppearanceFormContent() {
    const { theme, setTheme, availableThemes } = useAppTheme()
    const { font, setFont, availableFonts } = useAppFont()
    const form = useFormContext<AppearanceFormData>()
    
    const watchedFont = form.watch("font")
    const watchedTheme = form.watch("theme")

    // Apply font changes immediately
    useEffect(() => {
        if (watchedFont && watchedFont !== font) {
            setFont(watchedFont as any)
        }
    }, [watchedFont, setFont])

    // Apply theme changes immediately
    useEffect(() => {
        if (watchedTheme && watchedTheme !== theme) {
            setTheme(watchedTheme as Theme)
        }
    }, [watchedTheme, setTheme])

    return (
        <>
            {/* Font Selection */}
            <SettingsSectionItem
                title="Font"
                description="Choose your preferred font family"
                icon={<MdFontDownload className="h-5 w-5" />}
            >
                <ControlledSettingsFieldSelect
                    name="font"
                    title="Font Family"
                    description="The font will be applied immediately and saved for your next visit"
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
                <ControlledSettingsFieldSelect
                    name="theme"
                    title="Theme"
                    description="The theme will be applied immediately and saved for your next visit"
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
        </>
    )
}

// Appearance Settings Section
export function AppearanceSettingsSection() {
    const { theme, setTheme } = useAppTheme()
    const { font, setFont } = useAppFont()
    
    // Handle form submission
    const onSubmit = (data: AppearanceFormData) => {
        setFont(data.font as any)
        setTheme(data.theme as Theme)

        // Here you could also save to localStorage, API, etc.
        console.log("Settings saved:", data)
        
        // Return JSON data for external handling
        const jsonData = JSON.stringify(data, null, 2)
        console.log("Form data as JSON:", jsonData)
        
        // Here you can handle the JSON data as needed
        // For example, you could pass it to a parent component or store
        return jsonData
    }
  
    return (
        <SettingsMainContainer
            title="Appearance"
            description="Customize the look and feel of your application"
            defaultValues={{
                font: font,
                theme: theme
            }}
            onSubmit={onSubmit}
        >
            <AppearanceFormContent />
        </SettingsMainContainer>
    )
}
