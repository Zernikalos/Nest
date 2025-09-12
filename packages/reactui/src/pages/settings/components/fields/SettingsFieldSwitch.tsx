import { Switch } from "@/components/ui/switch"
import { SettingsFieldBase } from "./SettingsFieldBase"
import { Controller, useFormContext } from "react-hook-form"
import type { FieldPath, FieldValues } from "react-hook-form"

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

type ControlledSettingsFieldSwitchProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<SettingsFieldSwitchProps, 'checked' | 'onCheckedChange'> & {
    name: TName
}

/**
 * Controlled wrapper for SettingsFieldSwitch that integrates with react-hook-form.
 * Uses Controller to manage form state while maintaining the same visual interface.
 */
export function ControlledSettingsFieldSwitch<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    ...props
}: ControlledSettingsFieldSwitchProps<TFieldValues, TName>) {
    const { control } = useFormContext<TFieldValues>()
    
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <SettingsFieldSwitch
                    {...props}
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                />
            )}
        />
    )
}

ControlledSettingsFieldSwitch.displayName = "ControlledSettingsFieldSwitch"
