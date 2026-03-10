# KeepAliveRouter Architecture

## Overview

The KeepAliveRouter is designed as a lightweight, React Context-based routing solution that prioritizes **state preservation** over traditional routing patterns. This document explains the internal architecture, design decisions, and implementation details.

## Core Architecture

### Component Hierarchy

```
KeepAliveRouterProvider (Context Provider)
├── Navigator Store (Zustand)
│   ├── Navigator Class (Core Logic)
│   │   ├── Route Management
│   │   ├── Navigation Logic
│   │   ├── Route History (RouteHistory)
│   │   └── State Change Callbacks
│   └── Store Actions & Getters
│       ├── navigate(path, addToHistory?)
│       ├── goBack() / goForward()
│       ├── setRoutes(routes)
│       └── State Getters
├── Browser History Integration
│   ├── PopState Event Handling
│   ├── URL Synchronization (via RouteHistory)
│   └── History API Management
└── KeepAliveOutlet (Route Renderer)
    ├── Route Mounting Logic
    ├── Component Lifecycle Management
    ├── Display State Control
    └── Redirect Handling
```

## State Management

### Router Context Structure

```tsx
interface KeepAliveRouterContextType {
  currentRoute: string;           // Currently active route path
  navigate: (path: string, addToHistory?: boolean) => void; // Navigation function
  routes: Route[];                // Original route configuration
  flatRoutes: Route[];            // Flattened routes for easy lookup
  setRoutes: (routes: Route[]) => void; // Dynamic route updates
  isRouteActive: (path: string) => boolean; // Active route checker
  mountedRoutes: Set<string>;     // Set of routes that have been visited
  getRoutesForLevel: (level: number) => Route[]; // Get routes for nesting level
  getRouteLevel: (path: string) => number; // Get route nesting level
  getCurrentRouteSegments: () => string[]; // Get current route segments
  goBack: () => void;             // Navigate backward in history
  goForward: () => void;           // Navigate forward in history
  canGoBack: () => boolean;       // Check if can go back
  canGoForward: () => boolean;     // Check if can go forward
  history: readonly string[];      // Navigation history array
  historyIndex: number;            // Current position in history
}
```

### Navigator Class

The core routing logic is handled by the `Navigator` class, which is independent from React:

```tsx
class Navigator {
  private routes: Route[];
  private flatRoutes: Route[];
  private currentRoute: string;
  private mountedRoutes: Set<string>;
  private history: RouteHistory;
  private onStateChange?: (state: NavigatorState) => void;
  
  // Core methods
  navigate(path: string, addToHistory?: boolean): void;
  goBack(): void;
  goForward(): void;
  setRoutes(routes: Route[]): void;
  // ... more methods
}
```

### Zustand Store

The router uses Zustand for state management:

```tsx
interface NavigatorStore extends NavigatorState {
  // Actions
  navigate: (path: string, addToHistory?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  setRoutes: (routes: Route[]) => void;
  handlePopState: (path: string) => void;
  syncUrl: () => void;
  
  // Getters
  getRoutesForLevel: (level: number) => Route[];
  getRouteLevel: (path: string) => number;
  // ... more getters
  
  // Internal Navigator instance
  _navigator: Navigator;
}
```

### RouteHistory Class

Navigation history is managed by a separate `RouteHistory` class:

```tsx
class RouteHistory {
  private history: string[];
  private currentIndex: number;
  private maxSize?: number;
  
  add(path: string, addToHistory?: boolean): string;
  goBack(): string | null;
  goForward(): string | null;
  syncUrl(path: string): void;
  // ... more methods
}
```

### State Flow

1. **Initialization**: Router provider initializes with routes and initial route
2. **Route Flattening**: Nested routes are flattened for efficient lookup
3. **Navigation**: User navigates to new route
4. **Mounting**: Route is added to `mountedRoutes` set if not already present
5. **Rendering**: KeepAliveOutlet renders all mounted routes, showing only active one
6. **State Preservation**: Previous route components remain mounted but hidden

## Route Processing

### Route Flattening Algorithm

The router flattens nested routes to create a single array for efficient lookups:

```tsx
const flattenRoutes = (routes: Route[], parentPath = ''): Route[] => {
  const flattened: Route[] = [];
  
  for (const route of routes) {
    // Path resolution logic
    let fullPath: string;
    
    if (!parentPath) {
      // Top-level route
      fullPath = route.path;
    } else {
      // Nested route
      if (route.path === '') {
        // Index route - use parent path
        fullPath = parentPath;
      } else if (route.path.startsWith('/')) {
        // Absolute path (shouldn't happen in nested routes)
        fullPath = route.path;
      } else {
        // Relative path - combine with parent
        fullPath = `${parentPath}/${route.path}`;
      }
    }
    
    // Add flattened route
    flattened.push({
      ...route,
      path: fullPath,
      children: undefined, // Remove children to avoid circular references
    });
    
    // Recursively process children
    if (route.children) {
      flattened.push(...flattenRoutes(route.children, fullPath));
    }
  }
  
  return flattened;
};
```

### Path Resolution Rules

1. **Top-level routes**: Use path as-is
2. **Index routes**: Empty path (`""`) inherits parent path
3. **Nested routes**: Relative paths are combined with parent path
4. **Absolute nested paths**: Start with `/` (discouraged but supported)

## Component Lifecycle Management

### Keep-Alive Strategy

The KeepAliveOutlet implements the core keep-alive functionality:

```tsx
// Rendering logic in KeepAliveOutlet
{flatRoutes.map((route) => {
  const { path, component: Component } = route;
  const isActive = isRouteActive(path);
  const isMounted = mountedRoutes.has(path);
  
  // Only render if route has been visited
  if (!isMounted || !Component) {
    return null;
  }

  return (
    <div
      key={path}
      style={{
        display: isActive ? 'block' : 'none',  // Show/hide via CSS
        height: isActive ? 'auto' : '0',       // Prevent layout issues
        overflow: isActive ? 'visible' : 'hidden', // Hide overflow
      }}
    >
      <Component />
    </div>
  );
})}
```

### Mounting Strategy

1. **Lazy Mounting**: Components are only mounted when first visited
2. **Persistent Mounting**: Once mounted, components stay in DOM
3. **Display Control**: Active route is shown, others are hidden via CSS
4. **Memory Management**: Components remain in memory until router unmounts

## Browser Integration

### History API Integration

The router handles browser history through the `RouteHistory` class and `KeepAliveRouterProvider`:

```tsx
// In KeepAliveRouterProvider
useEffect(() => {
  const handlePopState = () => {
    const currentPath = window.location.pathname;
    useStore.getState().handlePopState(currentPath);
  };

  window.addEventListener('popstate', handlePopState);
  
  // Set initial URL
  useStore.getState().syncUrl();

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [useStore]);

// In Navigator.navigate()
navigate(path: string, addToHistory: boolean = true): void {
  // ... route mounting logic ...
  this.history.add(normalized, addToHistory);
  this.history.syncUrl(normalized);
}

// In RouteHistory
syncUrl(path: string): void {
  const normalized = normalizePath(path);
  if (window.location.pathname !== normalized) {
    window.history.replaceState(null, '', normalized);
  }
}
```

### URL Synchronization

1. **Initial Load**: Router syncs with current URL
2. **Navigation**: Updates URL via `pushState`
3. **Back/Forward**: Listens to `popstate` events
4. **Redirects**: Uses `replaceState` to avoid history pollution

## Performance Characteristics

### Memory Usage

| Aspect | Traditional Router | KeepAliveRouter |
|--------|-------------------|-----------------|
| Component Instances | 1 active | N mounted |
| DOM Nodes | Current route only | All visited routes |
| Memory Growth | Constant | Linear with visited routes |
| State Preservation | None | Full preservation |

### Performance Trade-offs

**Advantages:**
- Instant navigation between visited routes
- Complete state preservation
- No re-initialization overhead
- Preserved scroll positions and form data

**Disadvantages:**
- Higher memory consumption
- Larger DOM tree
- Potential memory leaks if not managed properly
- Initial mounting cost for each route

## Extension Points

### Custom Hooks

The architecture supports custom hooks built on top of the core context:

```tsx
// Example: Custom hook for route metadata
export const useRouteMetadata = () => {
  const { currentRoute, routes } = useKeepAliveRouter();
  const route = routes.find(r => r.path === currentRoute);
  
  return {
    title: route?.title,
    breadcrumbs: generateBreadcrumbs(currentRoute),
    canGoBack: window.history.length > 1,
  };
};
```

### Route Guards

Route protection can be implemented as wrapper components:

```tsx
const ProtectedRoute = ({ children, requiredPermission }) => {
  const hasPermission = usePermissions(requiredPermission);
  
  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

## Future Enhancements

### Planned Features

1. **Path Parameters**: Support for `/users/:id` patterns
2. **Query String Parsing**: Built-in search params handling
3. **Route Transitions**: Animation support between routes
4. **Memory Management**: Automatic cleanup of unused routes
5. **Route Guards**: Built-in authentication/authorization hooks
6. **Lazy Loading**: Dynamic import support for route components

### Architectural Considerations

1. **Backward Compatibility**: New features should not break existing API
2. **Performance**: Maintain current performance characteristics
3. **Bundle Size**: Keep additional features optional
4. **TypeScript**: Full type safety for all new features

## Comparison with Other Routers

### vs React Router

| Feature | React Router | KeepAliveRouter |
|---------|-------------|-----------------|
| Component Unmounting | Yes | No |
| State Preservation | No | Yes |
| Path Parameters | Yes | No |
| Nested Routes | Yes | Yes |
| Route Guards | Via HOCs | Via Components |
| Bundle Size | Larger | Smaller |
| Learning Curve | Moderate | Low |

### vs Reach Router (deprecated)

| Feature | Reach Router | KeepAliveRouter |
|---------|-------------|-----------------|
| Accessibility | Excellent | Basic |
| Focus Management | Automatic | Manual |
| Route Ranking | Advanced | Simple |
| Keep-Alive | No | Yes |

## Design Principles

### 1. Simplicity First
- Minimal API surface
- Intuitive component names
- Clear separation of concerns

### 2. State Preservation
- Components stay mounted
- Form data persists
- Scroll positions maintained

### 3. React Patterns
- Context for state management
- Hooks for functionality
- Components for UI

### 4. Performance Awareness
- Efficient route lookups
- Minimal re-renders
- Lazy mounting strategy

### 5. Extensibility
- Hook-based architecture
- Component composition
- Clear extension points

This architecture provides a solid foundation for keep-alive routing while maintaining simplicity and performance. The design prioritizes developer experience and state preservation over advanced routing features.
