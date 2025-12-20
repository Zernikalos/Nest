# KeepAliveRouter API Reference

## Components

### KeepAliveRouterProvider

The main context provider that manages routing state and provides routing functionality to child components.

**Props:**
```tsx
interface KeepAliveRouterProviderProps {
  children: ReactNode;
  initialRoute?: string;  // Default: '/'
  routes: Route[];
}
```

**Example:**
```tsx
<KeepAliveRouterProvider routes={appRoutes} initialRoute="/editor">
  <App />
</KeepAliveRouterProvider>
```

### KeepAliveOutlet

Renders all mounted route components, displaying only the active one while keeping others hidden. Supports nested outlets with automatic level detection. Uses React's native `Activity` component for efficient visibility management.

**Props:**
```tsx
// No props - component is self-contained
export const KeepAliveOutlet: React.FC = () => { ... }
```

**Behavior:**
- Mounts components when first visited
- Keeps mounted components in DOM but hidden using React's `Activity` component
- Shows only the active route component (mode="visible")
- Hides inactive routes (mode="hidden")
- Handles redirect routes automatically
- Automatically detects nesting level and renders only appropriate routes
- Supports multiple nested outlets like React Router
- **Uses native React Activity**: Leverages React 19's Activity API for optimal performance

**Examples:**

Basic usage:
```tsx
<KeepAliveOutlet />
```

Nested outlets:
```tsx
const AppLayout = () => (
  <div>
    <nav>Navigation</nav>
    <main>
      {/* Level 0 outlet - renders top-level routes */}
      <KeepAliveOutlet />
    </main>
  </div>
);

const DashboardLayout = () => (
  <div>
    <h2>Dashboard</h2>
    <div>
      {/* Level 1 outlet - renders dashboard child routes */}
      <KeepAliveOutlet />
    </div>
  </div>
);
```

### Link

Navigation component similar to react-router-dom's Link.

**Props:**
```tsx
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: (e?: React.MouseEvent) => void;
}
```

**Features:**
- Prevents default browser navigation
- Integrates with keep-alive routing
- Supports active state styling
- Maintains href attribute for accessibility

**Example:**
```tsx
<Link 
  to="/editor" 
  className="nav-link"
  activeClassName="nav-link-active"
>
  Editor
</Link>
```

### NavLink

Enhanced navigation component with render prop support.

**Props:**
```tsx
interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  to: string;
  children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
  className?: string;
  activeClassName?: string;
  onClick?: (e?: React.MouseEvent) => void;
}
```

**Example:**
```tsx
<NavLink to="/settings">
  {({ isActive }) => (
    <span className={isActive ? 'active' : ''}>
      Settings {isActive && '✓'}
    </span>
  )}
</NavLink>
```

### Navigate

Programmatic redirect component that automatically navigates when mounted.

**Props:**
```tsx
interface NavigateProps {
  to: string;
  replace?: boolean;  // Default: false
}
```

**Example:**
```tsx
// Redirect to login if not authenticated
{!isAuthenticated && <Navigate to="/login" replace />}
```

## Hooks

### useKeepAliveRouter

Core hook that provides access to the router context.

**Returns:**
```tsx
interface KeepAliveRouterContextType {
  currentRoute: string;
  navigate: (path: string, addToHistory?: boolean) => void;
  routes: Route[];
  flatRoutes: Route[];
  setRoutes: (routes: Route[]) => void;
  isRouteActive: (path: string) => boolean;
  mountedRoutes: Set<string>;
  getRoutesForLevel: (level: number) => Route[];
  getRouteLevel: (path: string) => number;
  getCurrentRouteSegments: () => string[];
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  history: readonly string[];
  historyIndex: number;
}
```

**Example:**
```tsx
const { currentRoute, navigate, mountedRoutes } = useKeepAliveRouter();
```

### useNavigate

Hook for programmatic navigation, similar to react-router-dom.

**Returns:**
```tsx
(path: string, addToHistory?: boolean) => void
```

**Parameters:**
- `path: string` - The route path to navigate to
- `addToHistory?: boolean` - Whether to add to history (default: true). Set to false to replace current history entry.

**Example:**
```tsx
const navigate = useNavigate();

const handleSubmit = () => {
  // Process form...
  navigate('/success');
};

// Navigate without adding to history (replace current entry)
const handleRedirect = () => {
  navigate('/login', false);
};
```

### useCurrentRoute

Hook to get the current active route path.

**Returns:**
```tsx
string
```

**Example:**
```tsx
const currentRoute = useCurrentRoute();
console.log('Current route:', currentRoute); // "/editor"
```

### useLocation

Hook similar to react-router-dom's useLocation.

**Returns:**
```tsx
{
  pathname: string;
  search: string;    // Always empty
  hash: string;      // Always empty
  state: null;       // Always null
  key: string;       // Same as pathname
}
```

**Example:**
```tsx
const location = useLocation();
console.log('Current path:', location.pathname);
```

### useParams

Hook similar to react-router-dom's useParams. Currently returns empty object.

**Returns:**
```tsx
{}
```

**Note:** Path parameters are not yet supported.

### useRouteInfo

Enhanced hook that provides route metadata and navigation utilities.

**Returns:**
```tsx
{
  path: string;
  title?: string;
  component?: React.ComponentType;
  navigate: (path: string, addToHistory?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  history: readonly string[];
  historyIndex: number;
  routeExists: (path: string) => boolean;
  getRouteInfo: (path: string) => Route | undefined;
}
```

**Example:**
```tsx
const { title, goBack, routeExists } = useRouteInfo();

return (
  <div>
    <h1>{title}</h1>
    {routeExists('/previous') && (
      <button onClick={goBack}>Go Back</button>
    )}
  </div>
);
```

### useIsActive

Hook to check if a specific route is currently active.

**Parameters:**
- `path: string` - The route path to check

**Returns:**
```tsx
boolean
```

**Example:**
```tsx
const isEditorActive = useIsActive('/editor');

return (
  <button className={isEditorActive ? 'active' : ''}>
    Editor
  </button>
);
```

### useRoutes

Hook to get all available routes.

**Returns:**
```tsx
Route[]
```

**Example:**
```tsx
const routes = useRoutes();
const navItems = routes.map(route => ({
  path: route.path,
  title: route.title
}));
```

### useOutletLevel

**NEW**: Hook to get the current outlet nesting level. Useful for debugging and conditional rendering based on nesting depth.

**Returns:**
```tsx
interface OutletLevelContextType {
  level: number; // Current outlet level (0, 1, 2, etc.)
}
```

**Example:**
```tsx
const MyComponent = () => {
  const { level } = useOutletLevel();
  
  return (
    <div>
      <h2>Component at level {level}</h2>
      {level > 0 && <p>This is a nested component</p>}
    </div>
  );
};
```

## Types

### Route

Core route configuration interface.

```tsx
interface Route {
  path: string;
  component?: React.ComponentType;
  title?: string;
  children?: Route[];
  index?: boolean;
  redirectTo?: string;
  level?: number;        // NEW: Nesting level (auto-calculated)
  originalPath?: string; // NEW: Original path before flattening
}
```

**New Properties:**
- `level`: Automatically calculated nesting level (0, 1, 2, etc.)
- `originalPath`: The original path segment before route flattening

### RouteConfig

Configuration interface for route creation helpers.

```tsx
interface RouteConfig {
  path: string;
  component?: React.ComponentType;
  title?: string;
  children?: RouteConfig[];
  index?: boolean;
  redirectTo?: string;
}
```

## Route Configuration Helpers

### createRoutes

Creates routes array from route configurations.

**Parameters:**
- `configs: RouteConfig[]`

**Returns:**
- `Route[]`

**Example:**
```tsx
const routes = createRoutes([
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage }
]);
```

### createRoute

Creates a single route from configuration.

**Parameters:**
- `config: RouteConfig`

**Returns:**
- `Route`

**Example:**
```tsx
const homeRoute = createRoute({
  path: '/',
  component: HomePage,
  title: 'Home'
});
```

### RouteBuilder

Fluent API for building complex route configurations.

**Methods:**
- `path(path: string)` - Set route path
- `component(component: React.ComponentType)` - Set route component
- `title(title: string)` - Set route title
- `children(children: RouteConfig[])` - Set nested routes
- `index(isIndex?: boolean)` - Mark as index route
- `redirectTo(path: string)` - Set redirect target
- `build()` - Build the final route

**Example:**
```tsx
const route = RouteBuilder.create()
  .path('/dashboard')
  .component(DashboardPage)
  .title('Dashboard')
  .children([
    { path: 'settings', component: SettingsPage }
  ])
  .build();
```

### route

Convenience function for creating RouteBuilder instance.

**Returns:**
- `RouteBuilder`

**Example:**
```tsx
const dashboardRoute = route()
  .path('/dashboard')
  .component(DashboardPage)
  .build();
```

## Error Handling

### Common Errors

1. **"useKeepAliveRouter must be used within a KeepAliveRouterProvider"**
   - Occurs when using router hooks outside the provider context
   - Solution: Wrap your app with `KeepAliveRouterProvider`

2. **"Route must have at least a path"**
   - Occurs when using RouteBuilder without setting a path
   - Solution: Always call `.path()` method

3. **"Route must have either a component or redirectTo"**
   - Occurs when route has neither component nor redirect
   - Solution: Set either `component` or `redirectTo` property

## Debug Utilities

### routerLogger

The router uses a custom logger instance for debugging.

**Example:**
```tsx
import { routerLogger, setRouterLogLevel } from './keepaliverouter';

// Set log level programmatically
setRouterLogLevel('debug');

// Use logger directly (if needed)
routerLogger.info('Custom message', { data: 'value' });
```

**Available Log Levels:**
- `'error'` - Only errors
- `'warn'` - Warnings and errors
- `'info'` - Info, warnings, and errors
- `'debug'` - All log levels

### setRouterLogLevel

Set the log level for the router logger.

**Example:**
```tsx
import { setRouterLogLevel } from './keepaliverouter';

// Enable debug logging
setRouterLogLevel('debug');

// Reduce logging in production
setRouterLogLevel('error');
```

## Browser Integration

The router integrates with the browser's history API:

- **Forward/Back buttons**: Automatically handled via `popstate` events
- **URL updates**: Routes update the browser URL using `pushState`/`replaceState`
- **Direct URL access**: Initial route can be set from URL
- **History state**: Uses `pushState` for navigation, `replaceState` for redirects
- **History management**: Internal `RouteHistory` class manages navigation history independently

## Route Utilities

The router exports several utility functions for path manipulation:

- `normalizePath(path: string)`: Normalizes a path
- `joinPaths(...segments: string[])`: Joins path segments
- `splitPath(path: string)`: Splits path into segments
- `getPathUpToLevel(path: string, level: number)`: Gets path up to specific level
- `isExactMatch(path1: string, path2: string)`: Checks exact path match
- `isPathPrefix(path: string, prefix: string)`: Checks if path starts with prefix
- `getParentPath(path: string)`: Gets parent path
- `getPathDepth(path: string)`: Gets path depth/level
- `resolvePath(basePath: string, relativePath: string)`: Resolves relative paths
- `getQueryParams(url: string)`: Extracts query parameters
- `buildUrl(path: string, params?: Record<string, string | number | boolean>)`: Builds URL with params
- `getParentPaths(path: string)`: Gets all parent paths
- `findMatchingRoute<T>(routes: T[], targetPath: string)`: Finds matching route
- `flattenRoutes<T>(routes: T[], parentPath?: string, level?: number)`: Flattens nested routes

See **[DEBUGGING.md](./DEBUGGING.md)** for complete debugging guide.
