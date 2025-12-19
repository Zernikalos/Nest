# Nested Outlets in KeepAliveRouter

The KeepAliveRouter now supports nested outlets just like React Router, allowing you to create complex nested layouts with multiple levels of routing.

## How It Works

Each `KeepAliveOutlet` automatically detects its nesting level and only renders routes that belong to that specific level. This allows you to have multiple outlets in a nested hierarchy, where each outlet renders the appropriate content for its level.

### Key Concepts

1. **Outlet Levels**: Each outlet has a nesting level (0, 1, 2, etc.)
2. **Route Levels**: Routes are automatically assigned levels based on their nesting in the route configuration
3. **Automatic Detection**: Outlets automatically detect their level using React Context
4. **Level-based Rendering**: Each outlet only renders routes that match its level

## Basic Example

```tsx
import { KeepAliveRouterProvider, KeepAliveOutlet, createRoutes } from '@/keepaliverouter';

// Layout component with nested outlet
const AppLayout = () => (
  <div>
    <nav>Navigation</nav>
    <main>
      {/* This outlet renders level 1 routes */}
      <KeepAliveOutlet />
    </main>
  </div>
);

const DashboardLayout = () => (
  <div>
    <h2>Dashboard</h2>
    <nav>Dashboard Navigation</nav>
    <div>
      {/* This outlet renders level 2 routes */}
      <KeepAliveOutlet />
    </div>
  </div>
);

const routes = createRoutes([
  {
    path: '/',
    component: AppLayout,           // Level 0
    children: [
      {
        path: 'dashboard',
        component: DashboardLayout, // Level 1
        children: [
          {
            path: 'analytics',
            component: AnalyticsPage // Level 2
          }
        ]
      }
    ]
  }
]);
```

## Route Structure and Levels

Routes are automatically assigned levels based on their nesting:

```
/                     <- Level 0 (AppLayout)
├── dashboard         <- Level 1 (DashboardLayout)
│   ├── analytics     <- Level 2 (AnalyticsPage)
│   └── reports       <- Level 2 (ReportsPage)
└── settings          <- Level 1 (SettingsPage)
```

## Outlet Behavior

When navigating to `/dashboard/analytics`:

1. **Level 0 Outlet** (in root): Renders `AppLayout`
2. **Level 1 Outlet** (in AppLayout): Renders `DashboardLayout`  
3. **Level 2 Outlet** (in DashboardLayout): Renders `AnalyticsPage`

Each outlet only renders routes that belong to its specific level, ensuring proper nesting behavior.

## useOutletLevel Hook

You can access the current outlet level using the `useOutletLevel` hook:

```tsx
import { useOutletLevel } from '@/keepaliverouter';

const MyComponent = () => {
  const { level } = useOutletLevel();
  
  return <div>Current outlet level: {level}</div>;
};
```

## Advanced Example

See the complete example in `examples/NestedOutletsExample.tsx` for a full demonstration with:

- 3 levels of nesting
- Multiple outlets at different levels
- Navigation between nested routes
- Keep-alive functionality preserved at all levels

## Benefits

1. **React Router Compatibility**: Behaves just like React Router's nested outlets
2. **Automatic Level Detection**: No manual configuration needed
3. **Keep-Alive Preserved**: All the keep-alive functionality works at every level
4. **Clean Separation**: Each outlet only handles its own level's routes
5. **Performance**: Efficient rendering with level-based filtering

## Migration

If you have existing flat routes, they will continue to work. The new nesting feature is fully backward compatible. To enable nesting:

1. Structure your routes with proper `children` arrays
2. Add `<KeepAliveOutlet />` in parent components where you want child routes to render
3. That's it! The system automatically handles the rest

## Debugging

Enable router logging to see how routes are assigned levels:

```tsx
import { setRouterLogLevel } from '@/keepaliverouter';

// Set log level to debug to see detailed information
setRouterLogLevel('debug');
```

This will log information about route levels, outlet rendering, and nesting behavior to help with debugging.
