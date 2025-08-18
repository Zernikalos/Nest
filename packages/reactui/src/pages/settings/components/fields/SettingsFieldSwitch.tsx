import { Switch } from "@/components/ui/switch"
import { SettingsFieldBase } from "./SettingsFieldBase"

type SettingsFieldSwitchProps = {
    title: string
    description: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

/**
 * Settings field component for boolean/toggle values.
 * Renders a switch control with title and description.
 * Uses horizontal layout by default for optimal UX.
 */
export function SettingsFieldSwitch({
    title,
    description,
    checked,
    onCheckedChange
}: SettingsFieldSwitchProps) {
    return (
        <div data-component="settings-field-switch">
            <SettingsFieldBase title={title} description={description}>
                <Switch 
                    checked={checked} 
                    onCheckedChange={onCheckedChange}
                    data-component="settings-switch-control"
                />
            </SettingsFieldBase>
        </div>
    )
}

SettingsFieldSwitch.displayName = "SettingsFieldSwitch"
