export interface AppearanceFormData {
    font: string
    theme: string
}

export interface GeneralFormData {
    confirmBeforeExit: boolean
    reopenProjectsOnStartup: boolean
    autoSaveInactivitySeconds: number
    saveOnClose: "always" | "never" | "ask"
}

export interface SettingsFormData {
    appearance: AppearanceFormData
    general: GeneralFormData
}
