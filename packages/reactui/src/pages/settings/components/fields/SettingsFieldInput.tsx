import { Input } from "@/components/ui/input"
import { SettingsFieldBase } from "./SettingsFieldBase"

type SettingsFieldInputProps = {
    title: string
    description: string
    value: string | number
    onChange: (value: string) => void
    type?: string
    min?: number
    max?: number
    placeholder?: string
    className?: string
    suffix?: string
    layout?: "horizontal" | "vertical"
}

/**
 * Settings field component for text and numeric input values.
 * Supports various input types, validation ranges, and optional suffix.
 * Uses vertical layout by default to accommodate longer inputs.
 */
export function SettingsFieldInput({
    title,
    description,
    value,
    onChange,
    type = "text",
    min,
    max,
    placeholder,
    className,
    suffix,
    layout = "vertical"
}: SettingsFieldInputProps) {
    const inputElement = (
        <div 
            className="flex items-center gap-3"
            data-component="settings-input-wrapper"
        >
            <Input
                type={type}
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={className}
                data-component="settings-input-control"
                data-input-type={type}
            />
            {suffix && (
                <span 
                    className="text-sm text-muted-foreground"
                    data-component="settings-input-suffix"
                >
                    {suffix}
                </span>
            )}
        </div>
    )

    return (
        <div data-component="settings-field-input">
            <SettingsFieldBase title={title} description={description} layout={layout}>
                {inputElement}
            </SettingsFieldBase>
        </div>
    )
}

SettingsFieldInput.displayName = "SettingsFieldInput"
