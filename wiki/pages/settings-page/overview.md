# Settings System Overview

## Introduction

The Settings system in Zernikalos Studio is a comprehensive, modular configuration interface that provides users with fine-grained control over application behavior and appearance. The system has evolved from a simple settings page into a sophisticated architecture featuring nested routing, reusable components, and seamless theme integration.

## High-Level Architecture

### System Components

```
SettingsPage (Main Container)
├── SettingsSidebar (Navigation)
│   └── SettingsSelectorSection[] (Navigation Items)
├── Router Outlet (Content Area)
│   └── Settings Sections
│       ├── GeneralSettingsSection
│       └── AppearanceSettingsSection
└── Layout System (SidebarLayout)
```

### Core Principles

- **Modularity**: Each component serves a specific purpose and can be reused
- **Consistency**: Unified design patterns across all settings
- **Extensibility**: Easy to add new sections and fields
- **Responsiveness**: Adapts to different screen sizes and devices
- **Accessibility**: Full keyboard navigation and screen reader support

## File Structure

```
src/pages/settings/
├── SettingsPage.tsx              # Main settings container
├── settingsRouter.tsx            # Route configuration
├── index.ts                      # Public exports
├── components/                   # Reusable UI components
│   ├── fields/                   # Settings field types
│   │   ├── SettingsFieldBase.tsx     # Base field component
│   │   ├── SettingsFieldSwitch.tsx   # Toggle switches
│   │   ├── SettingsFieldInput.tsx    # Text/number inputs
│   │   ├── SettingsFieldSelect.tsx   # Dropdown selectors
│   │   ├── SettingsFieldGeneric.tsx  # Custom content fields
│   │   └── index.ts                  # Field exports
│   ├── layout/                   # Layout components
│   │   ├── SettingsMainContainer.tsx # Section container
│   │   ├── SettingsSectionItem.tsx   # Individual setting cards
│   │   ├── SettingsSidebar.tsx       # Sidebar wrapper
│   │   └── index.ts                  # Layout exports
│   └── navigation/               # Navigation components
│       ├── SettingsSelectorSection.tsx # Sidebar navigation items
│       └── index.ts                    # Navigation exports
├── sections/                     # Settings sections
│   ├── general/                  # General application settings
│   │   ├── GeneralSettingsSection.tsx
│   │   └── index.ts
│   ├── appearance/               # Theme and UI settings
│   │   ├── AppearanceSettingsSection.tsx
│   │   └── index.ts
│   └── index.ts                  # Section exports
├── hooks/                        # Custom hooks (future)
│   └── index.ts
└── types/                        # TypeScript definitions (future)
```

## Routing System

### Route Structure

The settings system uses React Router's nested routing for smooth navigation:

```
/settings
├── /settings (redirects to /settings/general)
├── /settings/general     → GeneralSettingsSection
└── /settings/appearance  → AppearanceSettingsSection
```

### Navigation Flow

1. User clicks on sidebar navigation item
2. React Router updates the URL
3. Outlet component renders the appropriate section
4. Active state is automatically managed by React Router

## Component Hierarchy

### Layout Components

- **SettingsPage**: Top-level container that orchestrates the entire settings interface
- **SettingsSidebar**: Left navigation panel containing section selectors
- **SettingsMainContainer**: Content area wrapper with title and description
- **SettingsSectionItem**: Card-based container for related settings

### Field Components

- **SettingsFieldBase**: Foundation component providing consistent layout
- **SettingsFieldSwitch**: Boolean toggle controls
- **SettingsFieldInput**: Text and numeric input fields
- **SettingsFieldSelect**: Dropdown selection controls
- **SettingsFieldGeneric**: Flexible container for custom content

### Navigation Components

- **SettingsSelectorSection**: Individual sidebar navigation items with icons and descriptions

## Current Sections

### General Settings
**Path**: `/settings/general`
**Purpose**: Core application behavior configuration

**Features**:
- Exit confirmation dialog toggle
- Project reopening on startup
- Auto-save configuration (inactivity timer)
- Save behavior when closing projects

### Appearance Settings
**Path**: `/settings/appearance`
**Purpose**: Visual customization and theming

**Features**:
- Font family selection with live preview
- Theme selection with immediate application
- Theme preview cards showing color schemes
- Integration with global theme provider

## State Management

### Current Implementation
- **Local State**: Each section manages its own settings using React useState
- **Theme Integration**: Direct connection to theme and font providers
- **Immediate Updates**: Changes are applied instantly where possible

### Future Considerations
- **Persistence Layer**: Settings storage in localStorage or database
- **Global State**: Integration with application-wide state management
- **Validation**: Form validation and error handling
- **Reset Functionality**: Ability to restore default settings

## Design Patterns

### Consistent Field Layout
All settings fields follow a consistent pattern:
```tsx
<SettingsSectionItem title="Section" description="Description">
  <SettingsFieldType
    title="Field Name"
    description="Field description"
    value={value}
    onChange={handler}
  />
</SettingsSectionItem>
```

### Icon Integration
Each section and many fields include descriptive icons:
- Material Design icons for consistency
- Semantic meaning (palette for themes, settings gear for general)
- Consistent sizing (h-4 w-4 for navigation, h-5 w-5 for sections)

### Responsive Design
- Sidebar collapses on mobile devices
- Grid layouts adapt to screen size
- Touch-friendly controls on mobile

## Extension Points

### Adding New Sections
1. Create section component in `sections/[name]/`
2. Add route to `settingsRouter.tsx`
3. Add navigation item to `SettingsPage.tsx`
4. Export from appropriate index files

### Adding New Field Types
1. Create field component in `components/fields/`
2. Extend from `SettingsFieldBase` for consistency
3. Add to field exports
4. Use in section components

### Custom Layouts
The system supports custom layouts through:
- Generic field component for complex content
- Flexible section item containers
- CSS grid and flexbox utilities

## Integration Points

### Theme System
- Direct integration with `useAppTheme` hook
- Immediate theme switching capability
- Theme preview functionality

### Font System
- Integration with `useAppFont` hook
- Dynamic font loading and application
- Font preview in selection

### Future Integrations
- User preferences persistence
- Application state synchronization
- Plugin system for custom settings
- Import/export functionality

## Performance Considerations

### Current Optimizations
- Component-level state management
- Minimal re-renders through proper state isolation
- Efficient routing with React Router

### Future Optimizations
- Lazy loading of settings sections
- Memoization of complex components
- Debounced input handling
- Virtual scrolling for large option lists

## Accessibility Features

### Current Implementation
- Semantic HTML structure
- Proper ARIA labels and descriptions
- Keyboard navigation support
- Focus management

### Standards Compliance
- WCAG 2.1 AA compliance target
- Screen reader compatibility
- High contrast theme support
- Reduced motion preferences

---

This overview provides the foundation for understanding the Settings system architecture and serves as a starting point for exploring specific components and implementation details.
