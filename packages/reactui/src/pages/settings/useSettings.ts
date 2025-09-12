import { usePersistentState } from "@/hooks/usePersistentState"
import type { SettingsFormData, AppearanceFormData, GeneralFormData } from "./SettingsFormData"

// Default values for all settings
const defaultSettings: SettingsFormData = {
    appearance: {
        font: "Inter",
        theme: "dark"
    },
    general: {
        confirmBeforeExit: true,
        reopenProjectsOnStartup: false,
        autoSaveInactivitySeconds: 30,
        saveOnClose: "ask"
    }
}

// Validation function to ensure the stored data matches our expected structure
function validateSettings(value: any): value is SettingsFormData {
    if (!value || typeof value !== "object") return false
    
    // Validate appearance section
    if (!value.appearance || typeof value.appearance !== "object") return false
    if (typeof value.appearance.font !== "string") return false
    if (typeof value.appearance.theme !== "string") return false
    
    // Validate general section
    if (!value.general || typeof value.general !== "object") return false
    if (typeof value.general.confirmBeforeExit !== "boolean") return false
    if (typeof value.general.reopenProjectsOnStartup !== "boolean") return false
    if (typeof value.general.autoSaveInactivitySeconds !== "number") return false
    if (!["always", "never", "ask"].includes(value.general.saveOnClose)) return false
    
    return true
}

export function useSettings() {
    const [settings, setSettings] = usePersistentState<SettingsFormData>(
        "zernikalos-settings",
        defaultSettings,
        validateSettings
    )

    // Helper functions to update specific sections
    const updateAppearanceSettings = (appearance: Partial<AppearanceFormData>) => {
        setSettings({
            ...settings,
            appearance: { ...settings.appearance, ...appearance }
        })
    }

    const updateGeneralSettings = (general: Partial<GeneralFormData>) => {
        setSettings({
            ...settings,
            general: { ...settings.general, ...general }
        })
    }

    // Helper functions to get specific sections
    const getAppearanceSettings = () => settings.appearance
    const getGeneralSettings = () => settings.general

    // Reset to defaults
    const resetToDefaults = () => {
        setSettings(defaultSettings)
    }

    return {
        settings,
        setSettings,
        updateAppearanceSettings,
        updateGeneralSettings,
        getAppearanceSettings,
        getGeneralSettings,
        resetToDefaults,
        defaultSettings
    }
}
