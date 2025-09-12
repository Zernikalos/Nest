# Zernikalos Studio - LLM Documentation

This directory contains comprehensive documentation for Large Language Models to understand the Zernikalos Studio architecture, components, and patterns.

## 📚 Documentation Index

### 🏗️ Architecture & Overview
- **[Architecture Overview](./architecture-overview.md)** - Complete system architecture and design principles
- **[Tech Stack](./tech-stack.md)** - Technologies, frameworks, and build tools used

### 🗄️ State Management
- **[Stores Directory](./stores/)** - Zustand store implementations and patterns
  - **[ZkProject Store](./stores/zkproject-store.md)** - Project state management and file operations

### 🔌 Providers & Integration
- **[Providers Directory](./providers/)** - React context providers and system integration
  - **[ZkProject Provider](./providers/zkproject-provider.md)** - Project and Electron integration
  - **[Electron Provider](./providers/electron-provider.md)** - Electron API management

### 🎨 UI & Components
- **[UI Theming](./ui-theming.md)** - CSS variables, themes, and styling strategy
- **[TreeView Component](./treeview-component.md)** - Tree structure component documentation

### 🧭 Navigation & Pages
- **[Navigation System](./navigation-system.md)** - Sidebar navigation and routing system
- **[Pages Directory](./pages/)** - Application pages and functionality
  - **[Editor Page](./pages/editor-page.md)** - Main 3D editor interface
  - **[Settings Page](./pages/settings-page.md)** - Application configuration
  - **[Devices Page](./pages/devices-page.md)** - Device management (future)
  - **[Exporter Page](./pages/exporter-page.md)** - Export functionality (future)

## 🎯 Quick Reference

### Core Architecture
```
App.tsx → Providers → Stores → Components
```

### Key Technologies
- **React 18+** with TypeScript
- **Zustand** for state management
- **Electron** for desktop functionality
- **Tailwind CSS** for styling
- **shadcn/ui** for components

### State Management Pattern
- **Zustand stores** for business logic
- **React providers** for integration
- **Custom hooks** for component access

## 🚀 Development Guidelines

### Adding New Stores
1. Create store in `/src/stores/`
2. Document in `.llm/stores/`
3. Export from `stores/index.ts`

### Adding New Providers
1. Create provider in `/src/providers/`
2. Document in `.llm/providers/`
3. Update main providers index

### Component Development
1. Connect to stores via hooks
2. Use selective state subscription
3. Follow established patterns

### Adding New Pages
1. Create page component in `/src/pages/`
2. Add route to `src/router.tsx`
3. Add navigation item to `Sidebar.tsx`
4. Document in `.llm/pages/`

## 📖 For LLMs

This documentation is specifically formatted for Large Language Models to:
- Understand the project architecture
- Follow established patterns
- Implement consistent solutions
- Maintain code quality standards

Use these documents as reference when:
- Implementing new features
- Refactoring existing code
- Debugging issues
- Understanding system behavior
