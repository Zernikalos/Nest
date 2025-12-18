# Settings Page Documentation

The Settings Page provides a comprehensive configuration interface for Zernikalos Studio. It has evolved from a simple settings page into a sophisticated modular system featuring nested routing, reusable components, and seamless theme integration.

## 📋 Table of Contents

### Core Documentation
- **[Overview](./overview.md)** - Comprehensive system architecture and general overview
- **[Components Architecture](./components-architecture.md)** - Detailed component hierarchy and usage
- **[Fields System](./fields-system.md)** - Reusable field components and patterns
- **[Sections Guide](./sections-guide.md)** - Existing sections and how to create new ones

## 🎯 Quick Reference

### Main Components
- **Main Component**: `src/pages/settings/SettingsPage.tsx`
- **Router Configuration**: `src/pages/settings/settingsRouter.tsx`
- **Current Sections**: General, Appearance
- **Route Pattern**: `/settings/[section-name]`

## 🏗️ System Structure

```
src/pages/settings/
├── SettingsPage.tsx              # Main container
├── settingsRouter.tsx            # Route configuration
├── components/                   # Reusable components
│   ├── fields/                   # Settings field types
│   │   ├── SettingsFieldBase.tsx     # Base field component
│   │   ├── SettingsFieldSwitch.tsx   # Toggle switches
│   │   ├── SettingsFieldInput.tsx    # Text/number inputs
│   │   ├── SettingsFieldSelect.tsx   # Dropdown selectors
│   │   └── SettingsFieldGeneric.tsx  # Custom content fields
│   ├── layout/                   # Layout components
│   │   ├── SettingsMainContainer.tsx # Section container
│   │   ├── SettingsSectionItem.tsx   # Setting cards
│   │   └── SettingsSidebar.tsx       # Sidebar wrapper
│   └── navigation/               # Navigation components
│       └── SettingsSelectorSection.tsx # Sidebar items
├── sections/                     # Settings sections
│   ├── general/                  # General application settings
│   │   └── GeneralSettingsSection.tsx
│   └── appearance/               # Theme and UI settings
│       └── AppearanceSettingsSection.tsx
├── hooks/                        # Custom hooks (future)
└── types/                        # TypeScript definitions (future)
```

## ✨ Key Features

### Modular Architecture
- **Reusable Components**: Consistent field types across all sections
- **Extensible Design**: Easy to add new sections and field types
- **Type Safety**: Full TypeScript support throughout

### Nested Routing System
```
/settings
├── /settings (redirects to /settings/general)
├── /settings/general     → GeneralSettingsSection
└── /settings/appearance  → AppearanceSettingsSection
```

### Current Sections

#### General Settings (`/settings/general`)
- Exit confirmation dialog
- Project reopening on startup  
- Auto-save configuration (5-300 seconds)
- Save behavior when closing projects

#### Appearance Settings (`/settings/appearance`)
- Font family selection with live preview
- Theme selection with immediate application
- Theme preview cards
- Integration with global theme and font providers

### Field Component System

#### Available Field Types
- **SettingsFieldSwitch**: Boolean toggle controls
- **SettingsFieldInput**: Text and numeric inputs with validation
- **SettingsFieldSelect**: Dropdown selection with flexible options
- **SettingsFieldGeneric**: Custom content container

#### Consistent Patterns
All fields extend from `SettingsFieldBase` providing:
- Horizontal/vertical layout support
- Consistent typography and spacing
- Accessibility features (ARIA labels, keyboard navigation)
- Data attributes for testing

## 💡 Usage Examples

### Basic Field Usage
```tsx
<SettingsSectionItem
    title="Section Title"
    description="What this section configures"
    icon={<MdSettings className="h-5 w-5" />}
>
    <SettingsFieldSwitch
        title="Enable Feature"
        description="Toggle this feature on or off"
        checked={settings.featureEnabled}
        onCheckedChange={(checked) => handleChange("featureEnabled", checked)}
    />
</SettingsSectionItem>
```

### Provider Integration
```tsx
// Direct integration with global providers
const { theme, setTheme, availableThemes } = useAppTheme()

<SettingsFieldSelect
    title="Theme"
    description="Choose your preferred color scheme"
    value={theme}
    onValueChange={(value) => setTheme(value as Theme)}
    options={availableThemes.map(themeKey => ({
        value: themeKey,
        label: getThemeInfo(themeKey).name
    }))}
/>
```

## 🚀 Adding New Sections

### Quick Steps
1. **Create Component**: `src/pages/settings/sections/[name]/[Name]SettingsSection.tsx`
2. **Add Route**: Update `settingsRouter.tsx`
3. **Add Navigation**: Update `SettingsPage.tsx` with new `SettingsSelectorSection`
4. **Export**: Update index files

### Template Structure
```tsx
export function NewSettingsSection() {
    const [settings, setSettings] = useState({
        // Your settings here
    })

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    return (
        <SettingsMainContainer
            title="Section Title"
            description="What this section configures"
        >
            <SettingsSectionItem title="..." description="..." icon={...}>
                {/* Your fields here */}
            </SettingsSectionItem>
        </SettingsMainContainer>
    )
}
```

For detailed implementation guides, see [Sections Guide](./sections-guide.md).

## 🎨 Design Principles

### Consistency
- Uniform layout patterns across all sections
- Consistent spacing and typography
- Standardized icon usage (Material Design)

### Accessibility
- Full keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels and descriptions
- High contrast theme support

### Extensibility
- Easy to add new field types
- Pluggable section architecture
- Future-proof component design

### User Experience
- Immediate feedback for changes
- Clear visual hierarchy
- Responsive design for all screen sizes
- Intuitive navigation patterns

## 🔗 Integration Points

### Theme System
- Direct integration with `useAppTheme` hook
- Immediate theme switching
- Theme preview functionality

### State Management
- Component-level state for settings
- Future integration points for persistence
- Validation and error handling support

### Layout System
- Uses `SidebarLayout` for consistent responsive behavior
- Configurable sidebar width
- Proper content area management

## 🔮 Future Enhancements

### Planned Features
- Settings persistence layer
- Import/export functionality
- Search within settings
- Settings validation framework
- Plugin-based custom sections

### Extension Points
- Custom field types
- Advanced validation
- Real-time settings sync
- User profile management

## 📖 For Developers

### Quick Navigation
- **Create new section**: See [sections-guide.md](./sections-guide.md#creating-new-sections)
- **Add new field**: See [fields-system.md](./fields-system.md#custom-fields)
- **Modify layout**: See [components-architecture.md](./components-architecture.md#layout-system)

### For LLMs
- **Understand the structure**: Start with [overview.md](./overview.md)
- **Available components**: Check [components-architecture.md](./components-architecture.md)
- **Implementation patterns**: See examples in [sections-guide.md](./sections-guide.md)

---

*For detailed implementation guides, component specifications, and advanced patterns, please refer to the comprehensive documentation files in this folder.*
