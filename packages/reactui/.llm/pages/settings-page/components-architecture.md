# Components Architecture

## Overview

The Settings system is built on a hierarchical component architecture that promotes reusability, consistency, and maintainability. Each component serves a specific purpose in the settings interface, from high-level layout containers to granular field controls.

## Component Categories

### 1. Layout Components
High-level structural components that define the overall settings interface layout.

### 2. Field Components
Specialized input components for different types of settings configuration.

### 3. Navigation Components
Components responsible for section navigation and user guidance.

## Layout Components

### SettingsPage
**Location**: `src/pages/settings/SettingsPage.tsx`
**Purpose**: Main container orchestrating the entire settings interface

```tsx
export const SettingsPage = () => {
    return (
        <SettingsLayout
            sidebar={<SettingsSidebar>...</SettingsSidebar>}
            content={<div className="p-6"><Outlet /></div>}
            sidebarWidth="w-80"
        />
    )
}
```

**Key Features**:
- Integrates sidebar navigation with content area
- Uses `SettingsLayout` for consistent responsive behavior
- Manages routing through KeepAliveRouter `KeepAliveOutlet`
- Configurable sidebar width (320px default)

**Props**: None (self-contained component)

**Dependencies**:
- `SettingsSidebar`
- `SettingsSelectorSection`
- `SettingsLayout` from `src/pages/settings/layouts/SettingsLayout.tsx`
- KeepAliveRouter `KeepAliveOutlet`

---

### SettingsMainContainer
**Location**: `src/pages/settings/components/layout/SettingsMainContainer.tsx`
**Purpose**: Container for individual settings sections with title and description

```tsx
type SettingsSectionProps = {
    title: string
    description: string
    children: ReactNode
}

export function SettingsMainContainer({ title, description, children }: SettingsSectionProps) {
    return (
        <div className="space-y-6" data-component="settings-main-container">
            <div data-component="settings-header">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="space-y-6" data-component="settings-content">
                {children}
            </div>
        </div>
    )
}
```

**Key Features**:
- Consistent header layout with title and description
- Proper spacing between settings sections
- Data attributes for testing and debugging
- Responsive typography

**Props**:
- `title: string` - Section title (e.g., "General", "Appearance")
- `description: string` - Section description text
- `children: ReactNode` - Section content (typically `SettingsSectionItem` components)

**Usage Pattern**:
```tsx
<SettingsMainContainer
    title="General"
    description="Configure general application behavior and preferences"
>
    <SettingsSectionItem>...</SettingsSectionItem>
    <SettingsSectionItem>...</SettingsSectionItem>
</SettingsMainContainer>
```

---

### SettingsSectionItem
**Location**: `src/pages/settings/components/layout/SettingsSectionItem.tsx`
**Purpose**: Card-based container for related settings with optional icon

```tsx
type SettingsSectionItemProps = {
    title: string
    description: string
    icon?: ReactNode
    children: ReactNode
}

export function SettingsSectionItem({ title, description, icon, children }: SettingsSectionItemProps) {
    return (
        <Card data-component="settings-section-item">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon && <span>{icon}</span>}
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    )
}
```

**Key Features**:
- Card-based design for visual grouping
- Optional icon support for visual identification
- Consistent header layout
- Proper spacing for field components

**Props**:
- `title: string` - Section item title
- `description: string` - Section item description
- `icon?: ReactNode` - Optional icon (typically Material Design icons)
- `children: ReactNode` - Field components

**Usage Pattern**:
```tsx
<SettingsSectionItem
    title="Exit Confirmation"
    description="Ask for confirmation before closing the application"
    icon={<MdSettings className="h-5 w-5" />}
>
    <SettingsFieldSwitch ... />
    <SettingsFieldInput ... />
</SettingsSectionItem>
```

---

### SettingsSidebar
**Location**: `src/pages/settings/components/layout/SettingsSidebar.tsx`
**Purpose**: Container for settings navigation items

```tsx
export function SettingsSidebar({ children }: { children: ReactNode }) {
    return (
        <div className="space-y-2" data-component="settings-sidebar">
            {children}
        </div>
    )
}
```

**Key Features**:
- Simple wrapper with consistent spacing
- Designed to contain `SettingsSelectorSection` components
- Minimal styling for maximum flexibility

**Props**:
- `children: ReactNode` - Navigation section components

## Field Components

### SettingsFieldBase
**Location**: `src/pages/settings/components/fields/SettingsFieldBase.tsx`
**Purpose**: Foundation component providing consistent layout for all field types

```tsx
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
    // Implementation handles both horizontal and vertical layouts
}
```

**Key Features**:
- Dual layout support (horizontal/vertical)
- Consistent typography and spacing
- Label integration with proper accessibility
- Data attributes for component identification

**Layout Types**:
- **Horizontal**: Label/description on left, control on right (default)
- **Vertical**: Label/description above, control below

**Props**:
- `title: string` - Field label text
- `description: string` - Field description/help text
- `children: ReactNode` - The actual input control
- `layout?: "horizontal" | "vertical"` - Layout orientation

---

### SettingsFieldSwitch
**Location**: `src/pages/settings/components/fields/SettingsFieldSwitch.tsx`
**Purpose**: Boolean toggle control with consistent styling

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
- Extends `SettingsFieldBase` for consistency
- Integrates with shadcn/ui Switch component
- Proper accessibility attributes
- Disabled state support

**Usage Pattern**:
```tsx
<SettingsFieldSwitch
    title="Confirm before exit"
    description="Show a confirmation dialog when trying to close the application"
    checked={settings.confirmBeforeExit}
    onCheckedChange={(checked) => handleSettingChange("confirmBeforeExit", checked)}
/>
```

---

### SettingsFieldInput
**Location**: `src/pages/settings/components/fields/SettingsFieldInput.tsx`
**Purpose**: Text and numeric input control with validation

```tsx
type SettingsFieldInputProps = {
    title: string
    description: string
    value: string | number
    onChange: (value: string) => void
    type?: "text" | "number" | "email" | "password"
    placeholder?: string
    min?: number
    max?: number
    className?: string
    suffix?: string
    disabled?: boolean
    layout?: "horizontal" | "vertical"
}
```

**Key Features**:
- Multiple input types support
- Numeric validation (min/max)
- Suffix text support (e.g., "seconds")
- Custom className support
- Proper keyboard handling

**Usage Pattern**:
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

---

### SettingsFieldSelect
**Location**: `src/pages/settings/components/fields/SettingsFieldSelect.tsx`
**Purpose**: Dropdown selection control with option management

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
- Placeholder support
- Integration with shadcn/ui Select component
- Keyboard navigation
- Searchable options (if supported by underlying component)

**Usage Pattern**:
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

---

### SettingsFieldGeneric
**Location**: `src/pages/settings/components/fields/SettingsFieldGeneric.tsx`
**Purpose**: Flexible container for custom content that doesn't fit standard field types

```tsx
type SettingsFieldGenericProps = {
    title: string
    description: string
    children: ReactNode
    layout?: "horizontal" | "vertical"
}
```

**Key Features**:
- Maximum flexibility for custom content
- Consistent layout with other fields
- Ideal for complex controls (color pickers, preview areas, etc.)

**Usage Pattern**:
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
    </div>
</SettingsFieldGeneric>
```

## Navigation Components

### SettingsSelectorSection
**Location**: `src/pages/settings/components/navigation/SettingsSelectorSection.tsx`
**Purpose**: Individual navigation item for settings sections

```tsx
type SettingsSelectorSectionProps = {
    id: string
    name: string
    icon: ReactNode
    description: string
    to: string
}
```

**Key Features**:
- React Router integration with `NavLink`
- Automatic active state management
- Icon and description support
- Accessible navigation structure

**Usage Pattern**:
```tsx
<SettingsSelectorSection
    id="general"
    name="General"
    icon={<MdSettings className="h-4 w-4" />}
    description="General application settings"
    to="/settings/general"
/>
```

## Component Integration Patterns

### Hierarchical Structure
```tsx
// Typical settings section structure
<SettingsMainContainer title="..." description="...">
  <SettingsSectionItem title="..." description="..." icon={...}>
    <SettingsFieldSwitch ... />
    <SettingsFieldInput ... />
    <SettingsFieldSelect ... />
  </SettingsSectionItem>
  
  <SettingsSectionItem title="..." description="...">
    <SettingsFieldGeneric ... >
      {/* Custom content */}
    </SettingsFieldGeneric>
  </SettingsSectionItem>
</SettingsMainContainer>
```

### State Management Integration
```tsx
// Each section manages its own state
const [settings, setSettings] = useState({
    confirmBeforeExit: true,
    reopenProjectsOnStartup: false,
    autoSaveInactivitySeconds: 30,
    saveOnClose: "ask"
})

const handleSettingChange = (key: string, value: boolean | number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
}

// Fields connect to state through handlers
<SettingsFieldSwitch
    checked={settings.confirmBeforeExit}
    onCheckedChange={(checked) => handleSettingChange("confirmBeforeExit", checked)}
/>
```

### Theme Integration
```tsx
// Direct integration with theme providers
const { theme, setTheme, availableThemes } = useAppTheme()
const { font, setFont, availableFonts } = useAppFont()

<SettingsFieldSelect
    value={theme}
    onValueChange={(value) => setTheme(value as Theme)}
    options={availableThemes.map(themeKey => ({
        value: themeKey,
        label: getThemeInfo(themeKey).name
    }))}
/>
```

## Design System Integration

### Styling Approach
- **Tailwind CSS**: All components use Tailwind for styling
- **shadcn/ui Components**: Built on top of shadcn/ui primitives
- **CSS Custom Properties**: Theme integration through CSS variables
- **Responsive Design**: Mobile-first approach with breakpoint utilities

### Accessibility Standards
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliance

### Data Attributes
All components include `data-component` attributes for:
- **Testing**: Easy component identification in tests
- **Debugging**: Component hierarchy visualization
- **Analytics**: User interaction tracking

---

This architecture provides a solid foundation for building consistent, maintainable settings interfaces while remaining flexible enough to accommodate future requirements and customizations.
