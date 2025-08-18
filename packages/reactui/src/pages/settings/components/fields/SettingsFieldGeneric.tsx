import { SettingsFieldBase } from "./SettingsFieldBase"

type SettingsFieldGenericProps = {
    title: string
    description: string
    children: React.ReactNode
    layout?: "horizontal" | "vertical"
}

/**
 * Generic settings field component for custom content.
 * Allows rendering any custom React content within the standard field layout.
 * Useful for complex settings that don't fit standard field types.
 */
export function SettingsFieldGeneric({
    title,
    description,
    children,
    layout = "horizontal"
}: SettingsFieldGenericProps) {
    return (
        <div data-component="settings-field-generic">
            <SettingsFieldBase title={title} description={description} layout={layout}>
                <div data-component="settings-generic-content">
                    {children}
                </div>
            </SettingsFieldBase>
        </div>
    )
}

SettingsFieldGeneric.displayName = "SettingsFieldGeneric"
