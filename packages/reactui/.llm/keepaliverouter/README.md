# KeepAliveRouter Module

## Overview

The KeepAliveRouter is a custom React routing solution that provides **keep-alive functionality** for route components. Unlike traditional routers that unmount components when navigating away, this router preserves component state and DOM by keeping previously visited routes mounted but hidden.

## What is Keep-Alive Routing?

Keep-alive routing is a pattern where route components remain mounted in the DOM even when they're not the active route. This provides several benefits:

- **State Preservation**: Component state is maintained across route changes
- **Performance**: Avoids re-rendering and re-initialization of components
- **User Experience**: Preserves scroll positions, form data, and component state
- **Memory Trade-off**: Uses more memory but provides faster navigation

## Core Concepts

### 1. Route Mounting Strategy
- Routes are mounted when first visited
- Once mounted, routes stay in the DOM but are hidden when inactive
- Only the active route is visible (`display: block`), others are hidden (`display: none`)

### 2. State Management
- Uses Zustand store for router state management
- Navigator class handles core routing logic (independent from React)
- React Context provides router state to components
- Tracks current route, mounted routes, and navigation history
- Integrates with browser history API for back/forward navigation

### 3. Route Configuration
- Supports nested routes with automatic path resolution
- Declarative route configuration with helper functions
- Supports redirect routes and index routes

## Architecture

```
KeepAliveRouterProvider (Context Provider)
├── Navigator Store (Zustand)
│   ├── Navigator Class (Core Logic)
│   │   ├── Route Management
│   │   ├── Navigation Logic
│   │   └── Route History (RouteHistory)
│   └── State Synchronization
├── Browser History Integration
└── KeepAliveOutlet (Route Renderer)
    ├── Mounted Route Components (hidden)
    ├── Active Route Component (visible)
    └── Redirect Handling
```

## Key Features

### ✅ Supported Features
- **Keep-alive functionality** - Components stay mounted
- **Nested routes** - Full support with automatic path resolution
- **Programmatic navigation** - `useNavigate()` hook
- **Route state preservation** - Component state persists
- **Browser history integration** - Back/forward buttons work
- **Redirect routes** - Automatic redirects
- **Index routes** - Default child routes
- **Active route detection** - CSS classes and hooks
- **Route titles** - Title property for routes
- **Fluent API** - RouteBuilder for complex configurations
- **Comprehensive debugging** - Built-in logging and performance monitoring

### ❌ Not Supported
- **Path parameters** - `/users/:id` patterns
- **Query string parsing** - Search params handling
- **Route guards** - Authentication/authorization checks
- **Lazy loading** - Dynamic imports for routes
- **Route transitions** - Animations between routes

## Core Components

### 1. KeepAliveRouterProvider
The main context provider that manages routing state.

### 2. KeepAliveOutlet
Renders all mounted routes, showing only the active one. Uses React's native `Activity` component for efficient visibility management (mode="visible" for active route, mode="hidden" for inactive routes).

### 3. Link / NavLink
Navigation components similar to react-router-dom.

### 4. Navigate
Programmatic redirect component.

## Usage Patterns

### Basic Setup
```tsx
import { KeepAliveRouterProvider, KeepAliveOutlet, createRoutes } from './keepaliverouter';

const routes = createRoutes([
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage }
]);

function App() {
  return (
    <KeepAliveRouterProvider routes={routes} initialRoute="/">
      <KeepAliveOutlet />
    </KeepAliveRouterProvider>
  );
}
```

### Nested Routes
```tsx
const routes = createRoutes([
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome, index: true },
      { path: 'settings', component: SettingsPage },
      { path: 'profile', component: ProfilePage }
    ]
  }
]);
```

### Navigation
```tsx
import { useNavigate, Link, useIsActive, useRouteInfo } from './keepaliverouter';

function Navigation() {
  const navigate = useNavigate();
  const isHomeActive = useIsActive('/');
  const { goBack, goForward, canGoBack, canGoForward } = useRouteInfo();

  return (
    <nav>
      <Link to="/" activeClassName="active">Home</Link>
      <button onClick={() => navigate('/about')}>
        Go to About
      </button>
      <button onClick={goBack} disabled={!canGoBack()}>
        Back
      </button>
      <button onClick={goForward} disabled={!canGoForward()}>
        Forward
      </button>
    </nav>
  );
}
```

## File Structure

```
keepaliverouter/
├── index.ts                 # Main exports
├── types.ts                 # Type definitions
├── components/
│   ├── KeepAliveRouter.tsx  # Router provider and context
│   ├── KeepAliveOutlet.tsx  # Route rendering component
│   ├── Link.tsx             # Navigation components
│   └── Navigate.tsx         # Programmatic redirect component
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

## Integration with Project

The module is used in the Zernikalos Studio project for managing editor views, settings pages, and other application routes while preserving state across navigation.

## Performance Considerations

- **Memory Usage**: Higher memory consumption due to keeping components mounted
- **Initial Load**: Faster subsequent navigation after first visit
- **DOM Size**: Larger DOM tree with hidden components
- **State Management**: Requires careful consideration of component lifecycle
- **Activity API**: Uses React 19's native `Activity` component for efficient visibility management, providing better performance than manual display toggling

## When to Use

**Good for:**
- Applications with complex component state
- Forms with unsaved data
- Editor interfaces
- Dashboard applications
- Any scenario where state preservation is important

**Not ideal for:**
- Simple websites with stateless components
- Applications with memory constraints
- Routes with heavy components that should be unmounted

## Migration from react-router-dom

The API is designed to be similar to react-router-dom but with keep-alive functionality. Most hooks and components have similar names and interfaces, making migration easier.
