# Navigation System Documentation

## Overview

The navigation system in Zernikalos Studio is built around React Router with a sidebar-based navigation structure. The system provides a consistent navigation experience across different application sections.

## Core Components

### Sidebar Component
- **Location**: `src/components/sidebar/Sidebar.tsx`
- **Purpose**: Main navigation sidebar with icon-based navigation items
- **Features**: 
  - Fixed width (56px) sidebar
  - Icon-based navigation with tooltips
  - Active route highlighting
  - Responsive design

### SidebarItem Component
- **Location**: `src/components/sidebar/SidebarItem.tsx`
- **Purpose**: Individual navigation item with icon and tooltip
- **Features**:
  - Icon display with consistent sizing
  - Tooltip on hover
  - Active state styling
  - Link integration with React Router

## Navigation Structure

### Main Routes
```
/ → /editor (redirect)
├── /editor - Main editor interface
├── /devices - Device management (placeholder)
├── /exporter - Export functionality (placeholder)
└── /settings - Application settings
    ├── /settings/general - General settings
    └── /settings/appearance - Appearance settings
```

### Route Configuration
- **Router**: `src/router.tsx`
- **Layout**: `src/layouts/MainLayout.tsx`
- **Default Route**: Redirects `/` to `/editor`

## Navigation Features

### Active Route Detection
- Uses `useLocation` hook for current path
- Custom `isRouteActive` function for route matching
- Special handling for `/editor` route (matches both `/` and `/editor`)

### Icon System
- **Editor**: Journal/Code icon (`BsJournals`)
- **Devices**: Phone icon (`BsPhone`)
- **Export**: Boxes icon (`BsBoxSeam`)
- **Settings**: Gear icon (`BsGear`)

### Layout Integration
- Sidebar is integrated into `MainLayout`
- Uses fixed positioning for sidebar (fixed left-0 top-0)
- Sidebar has fixed width (56px) and full height
- Main content area uses flexbox with left margin (ml-[56px]) to account for fixed sidebar
- Main content has overflow-y-auto for scrolling
- Layout uses flexbox instead of CSS Grid

## State Management

### Navigation State
- Route state managed by React Router
- Active route highlighting through component state
- No global navigation state required

### Responsive Behavior
- Sidebar always visible on desktop
- Fixed positioning with shadow for depth
- Tooltips for accessibility on narrow sidebar

## Accessibility Features

### Keyboard Navigation
- Full keyboard support through React Router
- Focus management for navigation items
- Tooltip accessibility

### Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels through tooltips
- Clear navigation hierarchy

## Future Enhancements

### Planned Features
- Mobile responsive sidebar
- Collapsible sidebar option
- Breadcrumb navigation
- Search functionality

### Extension Points
- Easy addition of new navigation items
- Custom icon support
- Dynamic route generation
