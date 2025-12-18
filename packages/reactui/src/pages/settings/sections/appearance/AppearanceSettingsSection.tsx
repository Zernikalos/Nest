import { useAppTheme } from "@/providers/Theme"
import { useAppFont } from "@/providers/Font"
import { getThemeInfo, type Theme } from "@/lib/themes"
import { Button } from "@/components/ui/button"
import { MdPalette, MdFontDownload } from "react-icons/md"
import { SettingsMainContainer, SettingsSectionItem } from "@/pages/settings/components/layout"
import { ControlledSettingsFieldSelect, SettingsFieldGeneric } from "@/pages/settings/components/fields"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import type { AppearanceFormData } from "../../SettingsFormData"
import { useSettingsQuery, useUpdateSettingsMutation } from "../../hooks/useSettingsApi"

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
    const { setTheme, theme: currentTheme } = useAppTheme()
    const { setFont, font: currentFont } = useAppFont()
    const { data: settings, isLoading } = useSettingsQuery()
    const updateSettingsMutation = useUpdateSettingsMutation()
    
    // Handle form submission
    const onSubmit = async (data: AppearanceFormData) => {
        // Apply changes immediately for fast UX
        setFont(data.font as any)
        setTheme(data.theme as Theme)
        
        // Save to API
        try {
            await updateSettingsMutation.mutateAsync({
                theme: data.theme,
                font: data.font
            })
            console.log("Appearance settings saved:", data)
        } catch (error) {
            console.error("Failed to save appearance settings:", error)
        }
    }
  
    // Get default values from API or use current theme/font as fallback
    const defaultValues: AppearanceFormData = {
        theme: settings?.theme || currentTheme || "dark",
        font: settings?.font || currentFont || "Inter"
    }
  
    if (isLoading) {
        return (
            <SettingsMainContainer
                title="Appearance"
                description="Customize the look and feel of your application"
                defaultValues={{ theme: "dark", font: "Inter" }}
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
