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
- Uses React Context for global router state
- Tracks current route, mounted routes, and navigation history
- Integrates with browser history API for back/forward navigation

### 3. Route Configuration
- Supports nested routes with automatic path resolution
- Declarative route configuration with helper functions
- Supports redirect routes and index routes

## Architecture

```
KeepAliveRouterProvider (Context Provider)
├── Route State Management
├── Navigation Logic
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
- **Route metadata** - Titles and custom data
- **Fluent API** - RouteBuilder for complex configurations

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
Renders all mounted routes, showing only the active one.

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
import { useNavigate, Link, useIsActive } from './keepaliverouter';

function Navigation() {
  const navigate = useNavigate();
  const isHomeActive = useIsActive('/');

  return (
    <nav>
      <Link to="/" activeClassName="active">Home</Link>
      <button onClick={() => navigate('/about')}>
        Go to About
      </button>
    </nav>
  );
}
```

## File Structure

```
keepaliverouter/
├── index.ts                 # Main exports
├── KeepAliveRouter.tsx      # Core router logic and context
├── KeepAliveOutlet.tsx      # Route rendering component
├── createRoutes.ts          # Route configuration helpers
├── routerHooks.ts           # Additional hooks
├── Link.tsx                 # Navigation components
└── Navigate.tsx             # Programmatic redirect component
```

## Integration with Project

The module is used in the Zernikalos Studio project for managing editor views, settings pages, and other application routes while preserving state across navigation. The configuration is defined in `keepalive-router.config.tsx`.

## Performance Considerations

- **Memory Usage**: Higher memory consumption due to keeping components mounted
- **Initial Load**: Faster subsequent navigation after first visit
- **DOM Size**: Larger DOM tree with hidden components
- **State Management**: Requires careful consideration of component lifecycle

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
