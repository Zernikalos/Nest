# Pages Documentation

This directory contains documentation for all application pages and their functionality.

## Page Structure

### Core Pages
- **[Editor Page](./editor-page.md)** - Main 3D editor interface
- **[Projects Page](./projects-page/)** - Project management, creation, and ZKO conversion
- **[Settings Page](./settings-page/)** - Application configuration

### Placeholder Pages
- **[Devices Page](./devices-page.md)** - Device management (future implementation)
- **[Exporter Page](./exporter-page.md)** - Export functionality (future implementation)

## Common Patterns

### Page Layout
- All pages use `MainLayout` as base
- Consistent sidebar navigation
- Responsive grid-based layout

### State Management
- Pages connect to Zustand stores via hooks
- Local state for page-specific functionality
- Integration with global project state

### Routing Integration
- Pages are defined in `src/router.tsx`
- Nested routing for complex pages
- Lazy loading support for future optimization

## Page Development Guidelines

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route to `src/router.tsx`
3. Add navigation item to `Sidebar.tsx`
4. Document in this directory

### Page Structure
- Use functional components with hooks
- Implement proper error boundaries
- Follow established naming conventions
- Include proper TypeScript types

### Integration Points
- Connect to relevant stores via hooks
- Use shared UI components
- Follow established styling patterns
- Implement proper loading states
