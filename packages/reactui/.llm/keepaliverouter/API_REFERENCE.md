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

Renders all mounted route components, displaying only the active one while keeping others hidden.

**Props:**
```tsx
interface KeepAliveOutletProps {
  className?: string;
}
```

**Behavior:**
- Mounts components when first visited
- Keeps mounted components in DOM but hidden
- Shows only the active route component
- Handles redirect routes automatically

**Example:**
```tsx
<KeepAliveOutlet className="main-content" />
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
  navigate: (path: string) => void;
  routes: Route[];
  flatRoutes: Route[];
  setRoutes: (routes: Route[]) => void;
  isRouteActive: (path: string) => boolean;
  mountedRoutes: Set<string>;
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
(path: string) => void
```

**Example:**
```tsx
const navigate = useNavigate();

const handleSubmit = () => {
  // Process form...
  navigate('/success');
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
  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
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
}
```

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

## Browser Integration

The router integrates with the browser's history API:

- **Forward/Back buttons**: Automatically handled
- **URL updates**: Routes update the browser URL
- **Direct URL access**: Initial route can be set from URL
- **History state**: Uses `pushState` for navigation, `replaceState` for redirects
