import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { SettingsFieldBase } from "./SettingsFieldBase"
import { Controller, useFormContext } from "react-hook-form"
import type { FieldPath, FieldValues } from "react-hook-form"

type SelectOption = {
    value: string
    label: string
}

type SettingsFieldSelectProps = {
    title: string
    description: string
    value: string
    onValueChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    layout?: "horizontal" | "vertical"
}

/**
 * Settings field component for dropdown/select values.
 * Renders a select control with customizable options and placeholder.
 * Uses vertical layout by default to accommodate dropdown expansion.
 */
export function SettingsFieldSelect({
    title,
    description,
    value,
    onValueChange,
    options,
    placeholder = "Select option",
    className = "w-[300px]",
    layout = "vertical"
}: SettingsFieldSelectProps) {
    const selectElement = (
        <Select 
            value={value} 
            onValueChange={onValueChange}
            data-component="settings-select-control"
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent data-component="settings-select-dropdown">
                {options.map(option => (
                    <SelectItem 
                        key={option.value} 
                        value={option.value}
                        data-component="settings-select-option"
                        data-value={option.value}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )

    return (
        <div data-component="settings-field-select">
            <SettingsFieldBase title={title} description={description} layout={layout}>
                {selectElement}
            </SettingsFieldBase>
        </div>
    )
}

SettingsFieldSelect.displayName = "SettingsFieldSelect"

type ControlledSettingsFieldSelectProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<SettingsFieldSelectProps, 'value' | 'onValueChange'> & {
    name: TName
}

/**
 * Controlled wrapper for SettingsFieldSelect that integrates with react-hook-form.
 * Uses Controller to manage form state while maintaining the same visual interface.
 */
export function ControlledSettingsFieldSelect<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    ...props
}: ControlledSettingsFieldSelectProps<TFieldValues, TName>) {
    const { control } = useFormContext<TFieldValues>()
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <SettingsFieldSelect
                    {...props}
                    value={field.value || ""}
                    onValueChange={field.onChange}
                />
            )}
        />
    )
}

ControlledSettingsFieldSelect.displayName = "ControlledSettingsFieldSelect"
