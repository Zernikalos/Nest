# Settings Sections Guide

## Overview

Settings sections are the main organizational units of the configuration interface. Each section focuses on a specific aspect of application configuration and follows consistent patterns for structure, navigation, and user experience.

## Existing Sections

### General Settings Section

**Path**: `/settings/general`
**Component**: `GeneralSettingsSection`
**Location**: `src/pages/settings/sections/general/GeneralSettingsSection.tsx`

**Purpose**: Core application behavior and workflow configuration

#### Current Settings

##### Exit Confirmation
- **Type**: Boolean toggle (`SettingsFieldSwitch`)
- **Purpose**: Controls whether the app shows a confirmation dialog before closing
- **Default**: `true`
- **Implementation**:
```tsx
<SettingsFieldSwitch
    title="Confirm before exit"
    description="Show a confirmation dialog when trying to close the application"
    checked={settings.confirmBeforeExit}
    onCheckedChange={(checked) => handleSettingChange("confirmBeforeExit", checked)}
/>
```

##### Project Management
- **Type**: Boolean toggle (`SettingsFieldSwitch`)
- **Purpose**: Controls automatic project reopening on application startup
- **Default**: `false`
- **Implementation**:
```tsx
<SettingsFieldSwitch
    title="Reopen projects on startup"
    description="Automatically reopen the last opened projects when starting the application"
    checked={settings.reopenProjectsOnStartup}
    onCheckedChange={(checked) => handleSettingChange("reopenProjectsOnStartup", checked)}
/>
```

##### Auto-save Configuration
- **Type**: Numeric input (`SettingsFieldInput`)
- **Purpose**: Controls automatic saving after inactivity
- **Range**: 5-300 seconds
- **Default**: 30 seconds
- **Implementation**:
```tsx
<SettingsFieldInput
    title="Auto-save on inactivity"
    description="Automatically save the project if the editor is inactive for a specified time"
    value={settings.autoSaveInactivitySeconds}
    onChange={(value) => handleSettingChange("autoSaveInactivitySeconds", parseInt(value) || 30)}
    type="number"
    min={5}
    max={300}
    className="w-20"
    suffix="seconds"
/>
```

##### Save Behavior on Close
- **Type**: Dropdown selection (`SettingsFieldSelect`)
- **Purpose**: Controls what happens when closing a project
- **Options**: "always", "never", "ask"
- **Default**: "ask"
- **Implementation**:
```tsx
<SettingsFieldSelect
    title="Save behavior when closing"
    description="Choose what happens when you close a project"
    value={settings.saveOnClose}
    onValueChange={(value) => handleSettingChange("saveOnClose", value)}
    options={[
        { value: "always", label: "Always save" },
        { value: "never", label: "Never save" },
        { value: "ask", label: "Ask each time" }
    ]}
/>
```

#### State Management
```tsx
const [settings, setSettings] = useState({
    confirmBeforeExit: true,
    reopenProjectsOnStartup: false,
    autoSaveInactivitySeconds: 30,
    saveOnClose: "ask" // "always" | "never" | "ask"
})

const handleSettingChange = (key: string, value: boolean | number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
}
```

---

### Appearance Settings Section

**Path**: `/settings/appearance`
**Component**: `AppearanceSettingsSection`
**Location**: `src/pages/settings/sections/appearance/AppearanceSettingsSection.tsx`

**Purpose**: Visual customization and theming configuration

#### Current Settings

##### Font Family Selection
- **Type**: Dropdown selection (`SettingsFieldSelect`)
- **Purpose**: Choose application font family
- **Integration**: `useAppFont` hook from Font Provider
- **Features**: Live preview, immediate application
- **Implementation**:
```tsx
const { font, setFont, availableFonts } = useAppFont()

<SettingsFieldSelect
    title="Font Family"
    description="The font will be applied immediately and saved for your next visit"
    value={font}
    onValueChange={(value) => setFont(value as any)}
    options={availableFonts.map((fontKey) => ({
        value: fontKey,
        label: fontKey
    }))}
    placeholder="Select a font"
/>
```

##### Theme Selection
- **Type**: Dropdown selection (`SettingsFieldSelect`)
- **Purpose**: Choose color scheme and theme
- **Integration**: `useAppTheme` hook from Theme Provider
- **Features**: Immediate application, theme info display
- **Implementation**:
```tsx
const { theme, setTheme, availableThemes } = useAppTheme()

<SettingsFieldSelect
    title="Theme"
    description="The theme will be applied immediately and saved for your next visit"
    value={theme}
    onValueChange={(value) => setTheme(value as Theme)}
    options={availableThemes.map((themeKey) => {
        const themeInfo = getThemeInfo(themeKey as Theme)
        return {
            value: themeKey,
            label: themeInfo.name
        }
    })}
    placeholder="Select a theme"
/>
```

##### Theme Preview
- **Type**: Custom content (`SettingsFieldGeneric`)
- **Purpose**: Visual preview of selected theme
- **Features**: Live preview cards, button examples
- **Implementation**:
```tsx
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
        
        <div className="p-4 bg-muted border rounded-lg">
            <h4 className="font-medium mb-2">Muted Card</h4>
            <p className="text-muted-foreground">
                This shows the muted background and text colors.
            </p>
        </div>
    </div>
</SettingsFieldGeneric>
```

#### Provider Integration
The Appearance section directly integrates with application-wide providers:
- **Theme Provider**: `useAppTheme()` for theme management
- **Font Provider**: `useAppFont()` for font management
- **Theme Utilities**: `getThemeInfo()` for theme metadata

---

## Creating New Sections

### Step 1: Create Section Component

```tsx
// src/pages/settings/sections/[section-name]/[SectionName]SettingsSection.tsx

import { useState } from "react"
import { MdIcon } from "react-icons/md"
import { SettingsMainContainer, SettingsSectionItem } from "../../components/layout"
import { 
    SettingsFieldSwitch, 
    SettingsFieldInput, 
    SettingsFieldSelect 
} from "../../components/fields"

export function YourSettingsSection() {
    // 1. Define section state
    const [settings, setSettings] = useState({
        // Your settings here
        exampleSetting: true,
        anotherSetting: "default"
    })

    // 2. Create change handler
    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    // 3. Return section structure
    return (
        <SettingsMainContainer
            title="Your Section Title"
            description="Description of what this section configures"
        >
            <SettingsSectionItem
                title="Setting Group Title"
                description="Description of this group of settings"
                icon={<MdIcon className="h-5 w-5" />}
            >
                <SettingsFieldSwitch
                    title="Example Setting"
                    description="What this setting does"
                    checked={settings.exampleSetting}
                    onCheckedChange={(checked) => handleSettingChange("exampleSetting", checked)}
                />
                
                {/* Add more fields as needed */}
            </SettingsSectionItem>
            
            {/* Add more section items as needed */}
        </SettingsMainContainer>
    )
}
```

### Step 2: Create Section Index

```tsx
// src/pages/settings/sections/[section-name]/index.ts
export { YourSettingsSection } from "./YourSettingsSection"
```

### Step 3: Add to Sections Export

```tsx
// src/pages/settings/sections/index.ts
export { GeneralSettingsSection } from "./general"
export { AppearanceSettingsSection } from "./appearance"
export { YourSettingsSection } from "./your-section"  // Add your section
```

### Step 4: Add Route Configuration

```tsx
// src/pages/settings/settingsRouter.tsx
import { Navigate } from 'react-router-dom'
import { SettingsPage } from './SettingsPage'
import { 
    GeneralSettingsSection, 
    AppearanceSettingsSection,
    YourSettingsSection  // Import your section
} from './sections'

export const settingsRoutes = {
    path: 'settings',
    element: <SettingsPage />,
    children: [
        {
            index: true,
            element: <Navigate to="/settings/general" replace />,
        },
        {
            path: 'general',
            element: <GeneralSettingsSection />
        },
        {
            path: 'appearance',
            element: <AppearanceSettingsSection />
        },
        {
            path: 'your-section',  // Add your route
            element: <YourSettingsSection />
        }
    ]
}
```

### Step 5: Add Navigation Item

```tsx
// src/pages/settings/SettingsPage.tsx
import { MdSettings, MdPalette, MdYourIcon } from "react-icons/md"

export const SettingsPage = () => {
    return (
        <SettingsLayout
            sidebar={
                <SettingsSidebar>
                    <SettingsSelectorSection
                        id="general"
                        name="General"
                        icon={<MdSettings className="h-4 w-4" />}
                        description="General application settings"
                        to="/settings/general"
                    />
                    <SettingsSelectorSection
                        id="appearance"
                        name="Appearance"
                        icon={<MdPalette className="h-4 w-4" />}
                        description="Customize the look and feel of the application"
                        to="/settings/appearance"
                    />
                    <SettingsSelectorSection
                        id="your-section"
                        name="Your Section"
                        icon={<MdYourIcon className="h-4 w-4" />}
                        description="Description of your section"
                        to="/settings/your-section"
                    />
                </SettingsSidebar>
            }
            content={
                <div className="p-6">
                    <Outlet />
                </div>
            }
            sidebarWidth="w-80"
        />
    )
}
```

## Section Design Patterns

### State Management Pattern

```tsx
// 1. Define settings interface (optional but recommended)
interface SectionSettings {
    setting1: boolean
    setting2: string
    setting3: number
}

// 2. Initialize with defaults
const [settings, setSettings] = useState<SectionSettings>({
    setting1: true,
    setting2: "default",
    setting3: 100
})

// 3. Generic change handler
const handleSettingChange = <K extends keyof SectionSettings>(
    key: K,
    value: SectionSettings[K]
) => {
    setSettings(prev => ({ ...prev, [key]: value }))
}

// 4. Specific handlers for complex logic
const handleComplexSetting = (value: string) => {
    // Validation, transformation, side effects
    const processedValue = processValue(value)
    handleSettingChange("setting2", processedValue)
}
```

### Conditional Settings Pattern

```tsx
// Show/hide settings based on other settings
<SettingsSectionItem title="Advanced Options">
    <SettingsFieldSwitch
        title="Enable advanced mode"
        checked={settings.advancedMode}
        onCheckedChange={(checked) => handleSettingChange("advancedMode", checked)}
    />
    
    {settings.advancedMode && (
        <SettingsFieldInput
            title="Advanced setting"
            value={settings.advancedSetting}
            onChange={(value) => handleSettingChange("advancedSetting", value)}
        />
    )}
</SettingsSectionItem>
```

### Provider Integration Pattern

```tsx
// For settings that affect global application state
import { useAppTheme } from "@/providers/Theme"
import { useUserSettings } from "@/providers/UserSettings"

export function YourSettingsSection() {
    const { theme, setTheme } = useAppTheme()
    const { updateSetting } = useUserSettings()
    
    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme)  // Update global theme
        updateSetting("preferredTheme", newTheme)  // Persist setting
    }
    
    return (
        <SettingsFieldSelect
            value={theme}
            onValueChange={handleThemeChange}
            // ...
        />
    )
}
```

### Validation Pattern

```tsx
const [errors, setErrors] = useState<Record<string, string>>({})

const validateAndSet = (key: string, value: any, validator: (val: any) => string | null) => {
    const error = validator(value)
    
    setErrors(prev => ({ ...prev, [key]: error || "" }))
    
    if (!error) {
        handleSettingChange(key, value)
    }
}

// Usage
<SettingsFieldInput
    title="Port Number"
    description={errors.port || "Port number for the server"}
    value={settings.port}
    onChange={(value) => validateAndSet("port", value, (val) => {
        const num = parseInt(val)
        if (isNaN(num)) return "Must be a valid number"
        if (num < 1024) return "Port must be 1024 or higher"
        if (num > 65535) return "Port must be 65535 or lower"
        return null
    })}
    type="number"
    className={errors.port ? "border-red-500" : ""}
/>
```

## Best Practices

### Section Organization
- **Logical Grouping**: Group related settings together
- **Clear Hierarchy**: Use section items to create visual separation
- **Consistent Icons**: Use appropriate Material Design icons
- **Descriptive Text**: Provide clear titles and descriptions

### User Experience
- **Immediate Feedback**: Apply changes immediately when possible
- **Sensible Defaults**: Provide reasonable default values
- **Progressive Disclosure**: Hide advanced options behind toggles
- **Validation**: Provide clear error messages and validation

### Code Organization
- **Single Responsibility**: Each section focuses on one area
- **Consistent Patterns**: Follow established patterns for state management
- **Type Safety**: Use TypeScript interfaces for settings
- **Proper Exports**: Maintain clean index files

### Performance
- **Minimal Re-renders**: Use proper state isolation
- **Lazy Loading**: Consider lazy loading for complex sections
- **Memoization**: Memoize expensive computations

---

This guide provides the foundation for understanding existing sections and creating new ones that follow consistent patterns and provide excellent user experience.
