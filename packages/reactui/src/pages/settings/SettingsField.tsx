import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

// Base component for all settings fields
type SettingsFieldBaseProps = {
  title: string
  description: string
  children: ReactNode
  layout?: "horizontal" | "vertical"
}

export function SettingsFieldBase({
  title,
  description,
  children,
  layout = "horizontal"
}: SettingsFieldBaseProps) {
  if (layout === "horizontal") {
    return (
      <div className="flex items-center justify-between">
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
    <div className="space-y-4">
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

// Generic component for custom inputs
type SettingsFieldGenericProps = {
  title: string
  description: string
  children: ReactNode
  layout?: "horizontal" | "vertical"
}

export function SettingsFieldGeneric({
  title,
  description,
  children,
  layout = "horizontal"
}: SettingsFieldGenericProps) {
  return (
    <SettingsFieldBase title={title} description={description} layout={layout}>
      {children}
    </SettingsFieldBase>
  )
}

// Switch field component
type SettingsFieldSwitchProps = {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function SettingsFieldSwitch({
  title,
  description,
  checked,
  onCheckedChange
}: SettingsFieldSwitchProps) {
  return (
    <SettingsFieldBase title={title} description={description}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </SettingsFieldBase>
  )
}

// Input field component
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
    <div className="flex items-center gap-3">
      <Input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
      {suffix && (
        <span className="text-sm text-muted-foreground">{suffix}</span>
      )}
    </div>
  )

  return (
    <SettingsFieldBase title={title} description={description} layout={layout}>
      {inputElement}
    </SettingsFieldBase>
  )
}

// Select field component
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
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <SettingsFieldBase title={title} description={description} layout={layout}>
      {selectElement}
    </SettingsFieldBase>
  )
} 