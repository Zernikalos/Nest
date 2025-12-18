import { useEffect } from "react"
import { useAppTheme } from "@/providers/Theme"
import { useAppFont } from "@/providers/Font"
import { getThemeInfo, type Theme } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { MdPalette, MdFontDownload } from "react-icons/md"
import { SettingsMainContainer, SettingsSectionItem } from "@/pages/settings/components/layout"
import { ControlledSettingsFieldSelect, SettingsFieldGeneric } from "@/pages/settings/components/fields"
import type { AppearanceFormData } from "../../SettingsFormData"
import { useSettingsQuery } from "@/queries"
import { useWatch, useFormContext } from "react-hook-form"

// Component to handle real-time updates
function AppearanceFormContent() {
    const { availableThemes, setTheme, theme: currentTheme } = useAppTheme()
    const { availableFonts, setFont, font: currentFont } = useAppFont()
    const form = useFormContext<AppearanceFormData>()
    const watchedTheme = useWatch({ control: form.control, name: "theme" })
    const watchedFont = useWatch({ control: form.control, name: "font" })
    
    // Apply changes immediately when form values change
    useEffect(() => {
        if (watchedTheme && watchedTheme !== currentTheme) {
            setTheme(watchedTheme as Theme)
        }
    }, [watchedTheme, currentTheme, setTheme])
    
    useEffect(() => {
        if (watchedFont && watchedFont !== currentFont) {
            setFont(watchedFont as any)
        }
    }, [watchedFont, currentFont, setFont])

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
                    description="The font will be applied immediately and saved automatically"
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
                    description="The theme will be applied immediately and saved automatically"
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
                        <div className="p-4 bg-base-100 border border-base-300 rounded-lg shadow-sm">
                            <h4 className="font-medium mb-2 text-base-foreground">Primary Card</h4>
                            <p className="text-base-foreground/70 mb-3">
                                This card shows how the theme affects different elements.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm">Primary</Button>
                                <Button size="sm" variant="secondary">Secondary</Button>
                                <Button size="sm" variant="outline">Outline</Button>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-base-200 border border-base-300 rounded-lg shadow-sm">
                            <h4 className="font-medium mb-2 text-base-foreground">Secondary Card</h4>
                            <p className="text-base-foreground/70">
                                This shows the secondary background hierarchy.
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
    const { data: settings, isLoading } = useSettingsQuery()
    const { setTheme } = useAppTheme()
    const { setFont } = useAppFont()
    
    // Handle form submission
    // Note: Theme and font are already applied in real-time via AppearanceFormContent,
    // but this onSubmit is kept for consistency and to allow future extensions with additional fields
    const onSubmit = async (data: AppearanceFormData) => {
        // Apply changes using setTheme and setFont (optimistic update will update providers automatically)
        setTheme(data.theme as Theme)
        setFont(data.font as any)
        // Future: Add additional fields here that need to be saved on submit
    }
  
    // Get default values from server only
    const defaultValues: AppearanceFormData = {
        theme: (settings?.theme as Theme) || "default",
        font: (settings?.font as any) || "Rajdhani"
    }
  
    if (isLoading) {
        return (
            <SettingsMainContainer
                title="Appearance"
                description="Customize the look and feel of your application"
                defaultValues={{ theme: "default", font: "Rajdhani" }}
                onSubmit={onSubmit}
            >
                <AppearanceFormContent />
            </SettingsMainContainer>
        )
    }
  
    return (
        <SettingsMainContainer
            title="Appearance"
            description="Customize the look and feel of your application"
            defaultValues={defaultValues}
            onSubmit={onSubmit}
        >
            <AppearanceFormContent />
        </SettingsMainContainer>
    )
}
