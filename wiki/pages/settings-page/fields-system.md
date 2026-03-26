# Settings Fields System

## Overview

The Settings Fields System provides a comprehensive set of reusable components for building configuration interfaces. Each field type follows consistent design patterns while offering specialized functionality for different data types and interaction patterns.

## Design Principles

### Consistency
All field components extend from a common base (`SettingsFieldBase`) ensuring uniform:
- Layout and spacing
- Typography and styling  
- Accessibility features
- Data attributes for testing

### Flexibility
- **Dual Layout Support**: Horizontal and vertical orientations
- **Customizable Styling**: CSS class overrides where needed
- **Extensible Architecture**: Easy to create new field types

### Accessibility First
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Field Component Architecture

### Base Component: SettingsFieldBase

**Purpose**: Foundation component that provides consistent layout and styling for all field types.

```tsx
type SettingsFieldBaseProps = {
    title: string           // Field label
    description: string     // Help text
    children: ReactNode     // The actual input control
    layout?: "horizontal" | "vertical"  // Layout orientation
}
```

**Layout Modes**:

#### Horizontal Layout (Default)
```
[Label & Description]  [Control]
```
- Label and description on the left
- Input control on the right
- Ideal for simple controls (switches, selects)

#### Vertical Layout
```
[Label & Description]
[Control]
```
- Label and description above
- Input control below
- Better for complex controls or wide inputs

**Implementation**:
```tsx
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
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {children}
            </div>
        )
    }
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-base">{title}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    )
}
```

## Field Types

### SettingsFieldSwitch

**Purpose**: Boolean toggle controls for on/off settings.

```tsx
type SettingsFieldSwitchProps = {
    title: string
    description: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
    layout?: "horizontal" | "vertical"
}
```

**Key Features**:
- Uses shadcn/ui Switch component
- Immediate visual feedback
- Disabled state support
- Proper accessibility attributes

**Usage Examples**:
```tsx
// Basic toggle
<SettingsFieldSwitch
    title="Confirm before exit"
    description="Show a confirmation dialog when trying to close the application"
    checked={settings.confirmBeforeExit}
    onCheckedChange={(checked) => handleChange("confirmBeforeExit", checked)}
/>

// Disabled state
<SettingsFieldSwitch
    title="Auto-save"
    description="This feature is currently disabled"
    checked={false}
    onCheckedChange={() => {}}
    disabled={true}
/>
```

**Best Practices**:
- Use for boolean settings only
- Provide clear, actionable titles
- Explain the impact in descriptions
- Consider grouping related toggles

---

### SettingsFieldInput

**Purpose**: Text and numeric input controls with validation support.

```tsx
type SettingsFieldInputProps = {
    title: string
    description: string
    value: string | number
    onChange: (value: string) => void
    type?: "text" | "number" | "email" | "password"
    placeholder?: string
    min?: number        // For numeric inputs
    max?: number        // For numeric inputs
    className?: string  // Custom styling
    suffix?: string     // Display text after input (e.g., "seconds")
    disabled?: boolean
    layout?: "horizontal" | "vertical"
}
```

**Key Features**:
- Multiple input types
- Numeric validation (min/max)
- Suffix text support
- Custom styling options
- Placeholder text

**Usage Examples**:
```tsx
// Numeric input with validation
<SettingsFieldInput
    title="Auto-save interval"
    description="Time in seconds before auto-saving inactive projects"
    value={settings.autoSaveInterval}
    onChange={(value) => handleChange("autoSaveInterval", parseInt(value) || 30)}
    type="number"
    min={5}
    max={300}
    suffix="seconds"
    className="w-20"
/>

// Text input
<SettingsFieldInput
    title="Default project name"
    description="Name used for new projects"
    value={settings.defaultProjectName}
    onChange={(value) => handleChange("defaultProjectName", value)}
    type="text"
    placeholder="Untitled Project"
/>

// Email input
<SettingsFieldInput
    title="Notification email"
    description="Email address for system notifications"
    value={settings.notificationEmail}
    onChange={(value) => handleChange("notificationEmail", value)}
    type="email"
    placeholder="user@example.com"
/>
```

**Validation Patterns**:
```tsx
// Numeric validation with bounds
const handleNumericChange = (key: string, value: string, min: number, max: number) => {
    const numValue = parseInt(value) || min
    const clampedValue = Math.min(Math.max(numValue, min), max)
    setSettings(prev => ({ ...prev, [key]: clampedValue }))
}

// Text validation with length limits
const handleTextChange = (key: string, value: string, maxLength: number = 100) => {
    if (value.length <= maxLength) {
        setSettings(prev => ({ ...prev, [key]: value }))
    }
}
```

---

### SettingsFieldSelect

**Purpose**: Dropdown selection controls for choosing from predefined options.

```tsx
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
    disabled?: boolean
    layout?: "horizontal" | "vertical"
}
```

**Key Features**:
- Flexible option configuration
- Keyboard navigation
- Search functionality (inherited from shadcn/ui)
- Placeholder support
- Disabled state

**Usage Examples**:
```tsx
// Simple selection
<SettingsFieldSelect
    title="Theme"
    description="Choose your preferred color scheme"
    value={settings.theme}
    onValueChange={(value) => handleChange("theme", value)}
    options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" }
    ]}
/>

// Dynamic options from data
<SettingsFieldSelect
    title="Language"
    description="Select your preferred language"
    value={settings.language}
    onValueChange={(value) => handleChange("language", value)}
    options={availableLanguages.map(lang => ({
        value: lang.code,
        label: lang.name
    }))}
    placeholder="Select a language"
/>

// With complex option generation
<SettingsFieldSelect
    title="Font Family"
    description="Choose your preferred font"
    value={font}
    onValueChange={(value) => setFont(value)}
    options={availableFonts.map(fontKey => ({
        value: fontKey,
        label: fontKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }))}
/>
```

**Option Management Patterns**:
```tsx
// Static options
const saveOptions = [
    { value: "always", label: "Always save" },
    { value: "never", label: "Never save" },
    { value: "ask", label: "Ask each time" }
]

// Dynamic options from API or state
const themeOptions = useMemo(() => 
    availableThemes.map(themeKey => {
        const themeInfo = getThemeInfo(themeKey)
        return {
            value: themeKey,
            label: themeInfo.name
        }
    }), [availableThemes]
)

// Conditional options
const getExportOptions = (userRole: string) => {
    const baseOptions = [
        { value: "json", label: "JSON" },
        { value: "csv", label: "CSV" }
    ]
    
    if (userRole === "admin") {
        baseOptions.push({ value: "database", label: "Database Export" })
    }
    
    return baseOptions
}
```

---

### SettingsFieldGeneric

**Purpose**: Flexible container for custom content that doesn't fit standard field patterns.

```tsx
type SettingsFieldGenericProps = {
    title: string
    description: string
    children: ReactNode
    layout?: "horizontal" | "vertical"
}
```

**Key Features**:
- Maximum flexibility for custom controls
- Consistent layout with other fields
- Ideal for complex interactions
- Supports any React content

**Usage Examples**:
```tsx
// Color picker integration
<SettingsFieldGeneric
    title="Accent Color"
    description="Choose your preferred accent color"
    layout="vertical"
>
    <ColorPicker
        value={settings.accentColor}
        onChange={(color) => handleChange("accentColor", color)}
    />
</SettingsFieldGeneric>

// Theme preview
<SettingsFieldGeneric
    title="Theme Preview"
    description="See how your selected theme looks"
    layout="vertical"
>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card border rounded-lg">
            <h4 className="font-medium mb-2">Card Example</h4>
            <p className="text-muted-foreground mb-3">
                This card shows how the theme affects different elements.
            </p>
            <div className="flex gap-2">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">Secondary</Button>
                <Button size="sm" variant="outline">Outline</Button>
            </div>
        </div>
    </div>
</SettingsFieldGeneric>

// File upload area
<SettingsFieldGeneric
    title="Profile Picture"
    description="Upload a profile picture"
    layout="vertical"
>
    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
        <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="profile-upload"
        />
        <label
            htmlFor="profile-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
        >
            <MdCloudUpload className="h-8 w-8 text-muted-foreground" />
            <span>Click to upload or drag and drop</span>
        </label>
    </div>
</SettingsFieldGeneric>

// Multi-step configuration
<SettingsFieldGeneric
    title="Database Connection"
    description="Configure your database connection"
    layout="vertical"
>
    <div className="space-y-4">
        <Input
            placeholder="Database URL"
            value={dbConfig.url}
            onChange={(e) => setDbConfig(prev => ({ ...prev, url: e.target.value }))}
        />
        <div className="grid grid-cols-2 gap-4">
            <Input
                placeholder="Username"
                value={dbConfig.username}
                onChange={(e) => setDbConfig(prev => ({ ...prev, username: e.target.value }))}
            />
            <Input
                type="password"
                placeholder="Password"
                value={dbConfig.password}
                onChange={(e) => setDbConfig(prev => ({ ...prev, password: e.target.value }))}
            />
        </div>
        <Button onClick={testConnection} variant="outline">
            Test Connection
        </Button>
    </div>
</SettingsFieldGeneric>
```

## Creating Custom Fields

### Step 1: Extend SettingsFieldBase

```tsx
import { SettingsFieldBase } from "./SettingsFieldBase"

type SettingsFieldCustomProps = {
    title: string
    description: string
    // Add your specific props here
    value: YourValueType
    onChange: (value: YourValueType) => void
    // Optional common props
    disabled?: boolean
    layout?: "horizontal" | "vertical"
}

export function SettingsFieldCustom({
    title,
    description,
    value,
    onChange,
    disabled = false,
    layout = "horizontal"
}: SettingsFieldCustomProps) {
    return (
        <SettingsFieldBase
            title={title}
            description={description}
            layout={layout}
        >
            {/* Your custom control implementation */}
            <YourCustomControl
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </SettingsFieldBase>
    )
}
```

### Step 2: Add to Field Exports

```tsx
// components/fields/index.ts
export { SettingsFieldBase } from "./SettingsFieldBase"
export { SettingsFieldSwitch } from "./SettingsFieldSwitch"
export { SettingsFieldInput } from "./SettingsFieldInput"
export { SettingsFieldSelect } from "./SettingsFieldSelect"
export { SettingsFieldGeneric } from "./SettingsFieldGeneric"
export { SettingsFieldCustom } from "./SettingsFieldCustom"  // Add your field
```

### Step 3: Use in Settings Sections

```tsx
import { SettingsFieldCustom } from "../../components/fields"

<SettingsSectionItem title="..." description="...">
    <SettingsFieldCustom
        title="Custom Setting"
        description="Description of what this does"
        value={settings.customValue}
        onChange={(value) => handleChange("customValue", value)}
    />
</SettingsSectionItem>
```

## Advanced Patterns

### Conditional Fields

```tsx
// Show/hide fields based on other settings
{settings.enableAdvanced && (
    <SettingsFieldInput
        title="Advanced Option"
        description="This option is only available when advanced mode is enabled"
        value={settings.advancedOption}
        onChange={(value) => handleChange("advancedOption", value)}
    />
)}

// Disable fields based on conditions
<SettingsFieldSelect
    title="Export Format"
    description="Choose export format"
    value={settings.exportFormat}
    onValueChange={(value) => handleChange("exportFormat", value)}
    options={exportOptions}
    disabled={!settings.enableExport}
/>
```

### Field Groups

```tsx
// Group related fields visually
<SettingsSectionItem
    title="Auto-save Settings"
    description="Configure automatic saving behavior"
>
    <SettingsFieldSwitch
        title="Enable auto-save"
        description="Automatically save changes"
        checked={settings.autoSaveEnabled}
        onCheckedChange={(checked) => handleChange("autoSaveEnabled", checked)}
    />
    
    {settings.autoSaveEnabled && (
        <>
            <SettingsFieldInput
                title="Save interval"
                description="Time between automatic saves"
                value={settings.autoSaveInterval}
                onChange={(value) => handleChange("autoSaveInterval", parseInt(value))}
                type="number"
                min={1}
                max={60}
                suffix="minutes"
            />
            
            <SettingsFieldSelect
                title="Save location"
                description="Where to save auto-saved files"
                value={settings.autoSaveLocation}
                onValueChange={(value) => handleChange("autoSaveLocation", value)}
                options={[
                    { value: "local", label: "Local Storage" },
                    { value: "cloud", label: "Cloud Storage" }
                ]}
            />
        </>
    )}
</SettingsSectionItem>
```

### Validation and Error Handling

```tsx
const [errors, setErrors] = useState<Record<string, string>>({})

const validateAndChange = (key: string, value: any, validator: (val: any) => string | null) => {
    const error = validator(value)
    
    setErrors(prev => ({
        ...prev,
        [key]: error || ""
    }))
    
    if (!error) {
        handleChange(key, value)
    }
}

// Usage with validation
<SettingsFieldInput
    title="Max file size"
    description={errors.maxFileSize || "Maximum file size in MB"}
    value={settings.maxFileSize}
    onChange={(value) => validateAndChange("maxFileSize", value, (val) => {
        const num = parseInt(val)
        if (isNaN(num)) return "Must be a valid number"
        if (num < 1) return "Must be at least 1 MB"
        if (num > 1000) return "Cannot exceed 1000 MB"
        return null
    })}
    type="number"
    className={errors.maxFileSize ? "border-red-500" : ""}
/>
```

---

This fields system provides a robust foundation for building consistent, accessible, and maintainable settings interfaces while remaining flexible enough to accommodate future requirements and custom implementations.
