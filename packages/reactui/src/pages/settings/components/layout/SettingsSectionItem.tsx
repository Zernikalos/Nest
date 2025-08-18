import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type SettingsSectionItemProps = {
    title: string
    description: string
    icon?: ReactNode
    children: ReactNode
}

/**
 * Individual settings section component.
 * Renders a card with title, description, optional icon, and content area.
 * Designed to contain one or more settings field components.
 */
export function SettingsSectionItem({ 
    title, 
    description, 
    icon, 
    children 
}: SettingsSectionItemProps) {
    return (
        <Card data-component="settings-section-item">
            <CardHeader data-component="settings-section-header">
                <CardTitle 
                    className="flex items-center gap-2"
                    data-component="settings-section-title"
                >
                    {icon && (
                        <span data-component="settings-section-icon">
                            {icon}
                        </span>
                    )}
                    {title}
                </CardTitle>
                <CardDescription data-component="settings-section-description">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent 
                className="space-y-4"
                data-component="settings-section-content"
            >
                {children}
            </CardContent>
        </Card>
    )
}

SettingsSectionItem.displayName = "SettingsSectionItem"
