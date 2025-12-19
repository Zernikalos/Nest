# KeepAliveRouter Documentation Index

## Quick Start

For immediate implementation, start with:
1. **[README.md](./README.md)** - Overview and basic concepts
2. **[EXAMPLES.md](./EXAMPLES.md)** - Working code examples
3. **[API_REFERENCE.md](./API_REFERENCE.md)** - Complete API documentation

## Documentation Structure

### 📖 Core Documentation

- **[README.md](./README.md)**
  - What is KeepAliveRouter
  - Core concepts and architecture overview
  - Feature comparison and use cases
  - Quick usage examples

- **[API_REFERENCE.md](./API_REFERENCE.md)**
  - Complete component and hook documentation
  - Type definitions and interfaces
  - Error handling and browser integration
  - Detailed parameter descriptions

### 💡 Implementation Guides

- **[EXAMPLES.md](./EXAMPLES.md)**
  - Basic setup and configuration
  - Nested routes implementation
  - Programmatic navigation patterns
  - State preservation examples
  - Advanced route configuration

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**
  - Internal architecture and design decisions
  - Component hierarchy and state flow
  - Performance characteristics
  - Extension points and future enhancements

### 🔄 Migration and Best Practices

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**
  - Step-by-step migration from React Router
  - Feature mapping and limitations
  - Common migration patterns
  - Troubleshooting guide

- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)**
  - Component design patterns for keep-alive
  - Performance optimization strategies
  - Memory management techniques
  - Testing approaches and anti-patterns

- **[DEBUGGING.md](./DEBUGGING.md)**
  - Comprehensive debugging and logging guide
  - Debug categories and output examples
  - Performance monitoring and troubleshooting
  - Development workflow optimization

## Documentation Usage by Role

### 🧑‍💻 For Developers New to KeepAliveRouter
1. Start with **README.md** for concepts
2. Follow **EXAMPLES.md** for hands-on learning
3. Reference **API_REFERENCE.md** during implementation
4. Use **DEBUGGING.md** for development workflow
5. Apply **BEST_PRACTICES.md** for production code

### 🔧 For Developers Migrating from React Router
1. Read **MIGRATION_GUIDE.md** first
2. Use **API_REFERENCE.md** for feature mapping
3. Check **EXAMPLES.md** for equivalent patterns
4. Use **DEBUGGING.md** for troubleshooting migration issues
5. Follow **BEST_PRACTICES.md** for optimization

### 🏗️ For System Architects
1. Review **ARCHITECTURE.md** for design understanding
2. Analyze **README.md** for feature limitations
3. Consider **BEST_PRACTICES.md** for scalability
4. Review **DEBUGGING.md** for monitoring capabilities
5. Use **MIGRATION_GUIDE.md** for integration planning

### 🤖 For LLM/AI Systems
1. **README.md** provides complete context and concepts
2. **API_REFERENCE.md** contains all available APIs and types
3. **EXAMPLES.md** shows practical implementation patterns
4. **ARCHITECTURE.md** explains internal workings
5. **DEBUGGING.md** covers logging and troubleshooting
6. **MIGRATION_GUIDE.md** helps with React Router comparisons
7. **BEST_PRACTICES.md** provides optimization guidance

## Key Concepts Summary

### What is KeepAliveRouter?
A React routing solution that **preserves component state** by keeping route components mounted in the DOM even when they're not active. Unlike traditional routers that unmount components on navigation, KeepAliveRouter hides inactive routes while maintaining their state.

### Core Benefits
- **State Preservation**: Form data, scroll positions, and component state persist
- **Performance**: Faster navigation after initial route visits
- **User Experience**: No re-initialization of complex components

### Main Components
- `KeepAliveRouterProvider`: Context provider for routing state
- `KeepAliveOutlet`: Renders all mounted routes (shows active, hides others)
- `Link`/`NavLink`: Navigation components
- `Navigate`: Programmatic redirect component

### Key Hooks
- `useNavigate()`: Programmatic navigation (with optional `addToHistory` parameter)
- `useCurrentRoute()`: Get current active route
- `useIsActive(path)`: Check if route is active
- `useRouteInfo()`: Enhanced route metadata and utilities (includes history, goBack, goForward)
- `useOutletLevel()`: Get current outlet nesting level
- `useLocation()`: Get location object (pathname, search, hash, state, key)
- `useParams()`: Get route parameters (currently returns empty object)
- `useRoutes()`: Get all available routes

### Route Configuration
```tsx
const routes = createRoutes([
  { path: '/', component: HomePage },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome, index: true },
      { path: 'settings', component: SettingsPage }
    ]
  }
]);
```

### Basic Setup
```tsx
<KeepAliveRouterProvider routes={routes} initialRoute="/">
  <KeepAliveOutlet />
</KeepAliveRouterProvider>
```

## Supported Features
✅ Keep-alive functionality  
✅ Nested routes with automatic level detection  
✅ Programmatic navigation with history control  
✅ Browser history integration (back/forward buttons)  
✅ Redirect routes  
✅ Index routes  
✅ Active route detection  
✅ Navigation history management (goBack, goForward)  
✅ Route utilities (path manipulation, query params, etc.)  
✅ Custom logging system  

## Limitations
❌ Path parameters (`/users/:id`)  
❌ Query string parsing  
❌ Route guards (implement manually)  
❌ Lazy loading (use React.lazy)  

## Performance Considerations
- **Higher memory usage** due to mounted components
- **Faster subsequent navigation** after first visit
- **Ideal for** form-heavy apps, editors, dashboards
- **Consider alternatives for** simple websites, memory-constrained environments

## File Organization in Project

The KeepAliveRouter module is located in:
```
packages/reactui/src/keepaliverouter/
├── index.ts                 # Main exports
├── types.ts                 # Type definitions
├── components/
│   ├── KeepAliveRouter.tsx  # Router provider and context
│   ├── KeepAliveOutlet.tsx  # Route rendering
│   ├── Link.tsx             # Navigation components
│   └── Navigate.tsx         # Programmatic redirects
├── core/
│   ├── navigator.ts         # Navigator class (core routing logic)
│   ├── navigatorStore.ts    # Zustand store wrapper
│   └── routeHistory.ts     # Route history management
├── hooks/
│   └── routerHooks.ts       # Router hooks
└── utils/
    ├── createRoutes.ts      # Route configuration helpers
    ├── routeUtils.ts        # Path utility functions
    └── logger.ts            # Logging utilities
```

## Integration Context

This router is specifically designed for the **Zernikalos Studio** project, a React-based application that requires:
- Editor state preservation across navigation
- Complex form handling in settings
- Dashboard views with persistent state
- Memory of user interactions and preferences

The keep-alive functionality is essential for maintaining the user's work context when navigating between different parts of the application.

---

*This documentation is designed to be comprehensive for both human developers and AI systems. Each file provides specific aspects of the KeepAliveRouter implementation while maintaining consistency and clarity across all documents.*
