# Zernikalos Studio - LLM Documentation

This directory contains comprehensive documentation for Large Language Models to understand the Zernikalos Studio architecture, components, and patterns.

## 📚 Documentation Index

### 🏗️ Architecture & Overview
- **[Architecture Overview](./architecture-overview.md)** - Complete system architecture and design principles
- **[Tech Stack](./tech-stack.md)** - Technologies, frameworks, and build tools used
- **[Vue UI](./vueui/)** - Primary Vue-based renderer shell, routing, adapter layer, and host integration
- **[IDE Core](./ide-core/)** - Root-level framework-agnostic editor runtime, state modules, and contracts

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

### 🛠️ Utilities & Infrastructure
- **[Logger System](./logger.md)** - Centralized logging system with global level control

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
```text
Electron host -> vueui -> ide-core runtime -> nestserver/services
```

### Current Repository Shape
```text
root package.json -> config/* -> electronapp | nestserver | ide-core | vueui
                                       |
                                       -> packages/reactui (legacy exception)
```

### Key Technologies
- **Vue 3** with TypeScript for the primary renderer
- **React 19** for the legacy isolated renderer package (`reactui`)
- **Pinia / local stores** for renderer-local state
- **Electron** for desktop functionality
- **Nest-compatible server layer** embedded through the Electron host
- **Tailwind CSS** for styling
- **Radix / component libraries** for renderer UI primitives

### State Management Pattern
- **ide-core** owns editor domain/runtime behavior
- **renderer-local stores** own local shell state and preferences
- **adapters/composables/hooks** translate UI events into runtime intents
- **Electron/Nest host integration** stays outside the runtime core

## 🚀 Development Guidelines

### Adding New Stores (Local State)
1. Create store in the relevant renderer (`vueui/src/stores/` or `packages/reactui/src/stores/` when applicable)
2. Keep business/domain logic out of the store when it belongs in `ide-core`
3. Document the behavior in the wiki section that matches the renderer

### Adding New Queries (Server State)
1. Create queries/mutations in `/src/queries/`
2. Use query key factories for cache management
3. Export from `queries/index.ts`
4. Document in `.llm/queries/`

### Adding New Providers
1. Create the provider/composable in the relevant renderer
2. Keep host-specific integration out of `ide-core`
3. Update the matching wiki section

### Component Development
1. Connect to stores via hooks
2. Use selective state subscription
3. Follow established patterns

### Adding New Pages
1. Create the page inside the active renderer (`vueui/src/views/` or `packages/reactui/src/pages/`)
2. Wire the route in that renderer
3. Update navigation in that renderer
4. Document the feature in the wiki

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
