# Zernikalos Studio - LLM Documentation

This directory contains comprehensive documentation for Large Language Models to understand the Zernikalos Studio architecture, components, and patterns.

## 📚 Documentation Index

### 🏗️ Architecture & Overview
- **[Architecture Overview](./architecture-overview.md)** - Complete system architecture and design principles
- **[Tech Stack](./tech-stack.md)** - Technologies, frameworks, and build tools used

### 🗄️ State Management
- **[Stores Directory](./stores/)** - Zustand store implementations (local state only)
  - **[useProjectStore](./stores/useProjectStore.md)** - Project file path (local state)
  - **[useZkoStore](./stores/useZkoStore.md)** - Current ZKO state management
  - **[useProjectUIStore](./stores/useProjectUIStore.md)** - UI state management
- **[Queries Directory](./queries/)** - React Query queries and mutations (server state)
  - **[Queries Overview](./queries/README.md)** - React Query architecture and patterns

### 🔌 Providers & Integration
- **[Providers Directory](./providers/)** - React context providers and system integration
  - **[Electron Provider](./providers/electron-provider.md)** - Electron API management
  - **useElectronProjectIntegration** - Hook for Electron project integration (replaces ZkProjectProvider)

### 🎨 UI & Components
- **[UI Theming](./ui-theming.md)** - CSS variables, themes, and styling strategy
- **[TreeView Component](./treeview-component.md)** - Tree structure component documentation

### 🧭 Navigation & Pages
- **[Navigation System](./navigation-system.md)** - Sidebar navigation and routing system
- **[Pages Directory](./pages/)** - Application pages and functionality
  - **[Editor Page](./pages/editor-page.md)** - Main 3D editor interface
  - **[Projects Page](./pages/projects-page/)** - Project management, creation, and ZKO conversion
  - **[Settings Page](./pages/settings-page/)** - Application configuration
  - **[Devices Page](./pages/devices-page.md)** - Device management (future)
  - **[Exporter Page](./pages/exporter-page.md)** - Export functionality (future)

## 🎯 Quick Reference

### Core Architecture
```
App.tsx → Providers → Stores → Components
```

### Key Technologies
- **React 18+** with TypeScript
- **Zustand** for local state management
- **React Query (TanStack Query)** for server state management
- **Electron** for desktop functionality
- **Tailwind CSS** for styling
- **shadcn/ui** for components

### State Management Pattern
- **Zustand stores** for local/client state only (no business logic)
- **React Query** for server state (automatic caching, background refetching)
- **Custom hooks** for business logic and orchestration (combine Zustand + React Query)
- **React providers** for external system integration (when context needed)

## 🚀 Development Guidelines

### Adding New Stores (Local State)
1. Create store in `/src/stores/` (for local/client state only)
2. Document in `.llm/stores/`
3. Export from `stores/index.ts`

### Adding New Queries (Server State)
1. Create queries/mutations in `/src/queries/`
2. Use query key factories for cache management
3. Export from `queries/index.ts`
4. Document in `.llm/queries/`

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
