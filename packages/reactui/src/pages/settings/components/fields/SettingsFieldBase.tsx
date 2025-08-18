import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

type SettingsFieldBaseProps = {
    title: string
    description: string
    children: ReactNode
    layout?: "horizontal" | "vertical"
}

/**
 * Base component for all settings fields.
 * Provides consistent layout and styling for title, description, and field content.
 * Supports both horizontal and vertical layouts.
 */
export function SettingsFieldBase({
    title,
    description,
    children,
    layout = "horizontal"
}: SettingsFieldBaseProps) {
    if (layout === "horizontal") {
        return (
            <div 
                className="flex items-center justify-between"
                data-component="settings-field-base"
                data-layout="horizontal"
            >
                <div className="space-y-0.5">
                    <Label className="text-base">{title}</Label>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                {children}
            </div>
        )
    }

    return (
        <div 
            className="space-y-4"
            data-component="settings-field-base"
            data-layout="vertical"
        >
            <div className="space-y-2">
                <Label className="text-base">{title}</Label>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            {children}
        </div>
    )
}

SettingsFieldBase.displayName = "SettingsFieldBase"
