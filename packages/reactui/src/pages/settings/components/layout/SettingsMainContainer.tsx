import type { ReactNode } from "react"

type SettingsSectionProps = {
    title: string
    description: string
    children: ReactNode
}

/**
 * Main container component for settings pages.
 * Provides consistent layout with title, description, and content area.
 * Designed to contain multiple SettingsSectionItem components.
 */
export function SettingsMainContainer({ title, description, children }: SettingsSectionProps) {
    return (
        <div 
            className="space-y-6"
            data-component="settings-main-container"
        >
            <div data-component="settings-header">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>

            <div 
                className="space-y-6"
                data-component="settings-content"
            >
                {children}
            </div>
        </div>
    )
}

SettingsMainContainer.displayName = "SettingsMainContainer"
