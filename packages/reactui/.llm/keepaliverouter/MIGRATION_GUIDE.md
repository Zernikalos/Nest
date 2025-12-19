# Migration Guide: From React Router to KeepAliveRouter

## Overview

This guide helps developers migrate from React Router (v6) to KeepAliveRouter while understanding the key differences and benefits of the keep-alive approach.

## Key Differences

### Component Lifecycle

**React Router:**
```tsx
// Components are mounted/unmounted on route changes
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // This runs every time user navigates to this route
    loadUserData();
  }, []);
  
  // Component state is lost when navigating away
  return <div>{/* Component content */}</div>;
};
```

**KeepAliveRouter:**
```tsx
// Components stay mounted after first visit
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // This runs only on first mount
    loadUserData();
  }, []);
  
  // Component state is preserved when navigating away
  return <div>{/* Component content */}</div>;
};
```

## Migration Steps

### 1. Replace Router Provider

**Before (React Router):**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**After (KeepAliveRouter):**
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

### 2. Update Route Definitions

**Before (React Router):**
```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="profile" element={<ProfilePage />} />
  </Route>
  <Route path="/login" element={<LoginPage />} />
</Routes>
```

**After (KeepAliveRouter):**
```tsx
const routes = createRoutes([
  { path: '/', component: HomePage },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome, index: true },
      { path: 'settings', component: SettingsPage },
      { path: 'profile', component: ProfilePage }
    ]
  },
  { path: '/login', component: LoginPage }
]);
```

### 3. Update Navigation Components

**Before (React Router):**
```tsx
import { Link, NavLink } from 'react-router-dom';

<Link to="/about">About</Link>
<NavLink 
  to="/dashboard" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Dashboard
</NavLink>
```

**After (KeepAliveRouter):**
```tsx
import { Link, NavLink } from './keepaliverouter';

<Link to="/about" activeClassName="active">About</Link>
<NavLink 
  to="/dashboard" 
  activeClassName="active"
>
  {({ isActive }) => (
    <span className={isActive ? 'active' : ''}>Dashboard</span>
  )}
</NavLink>
```

### 4. Update Hooks

**Before (React Router):**
```tsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const navigate = useNavigate();
const location = useLocation();
const params = useParams();
```

**After (KeepAliveRouter):**
```tsx
import { useNavigate, useLocation, useParams, useRouteInfo } from './keepaliverouter';

const navigate = useNavigate(); // Similar API, but accepts optional addToHistory parameter
const location = useLocation(); // Limited functionality (pathname only)
const params = useParams();     // Returns empty object (not supported yet)
const { goBack, goForward, canGoBack, canGoForward, history } = useRouteInfo(); // Additional utilities
```

### 5. Handle Redirects

**Before (React Router):**
```tsx
import { Navigate } from 'react-router-dom';

<Route path="/old-path" element={<Navigate to="/new-path" replace />} />
```

**After (KeepAliveRouter):**
```tsx
// Option 1: In route configuration
{ path: '/old-path', redirectTo: '/new-path' }

// Option 2: Using Navigate component
import { Navigate } from './keepaliverouter';
<Navigate to="/new-path" replace />
```

## Feature Mapping

### Supported Features

| React Router Feature | KeepAliveRouter Equivalent | Notes |
|---------------------|---------------------------|--------|
| `BrowserRouter` | `KeepAliveRouterProvider` | Context-based provider |
| `Routes` + `Route` | `createRoutes` + `KeepAliveOutlet` | Declarative configuration |
| `Link` | `Link` | Similar API with `activeClassName` |
| `NavLink` | `NavLink` | Render prop support |
| `Navigate` | `Navigate` | Programmatic redirects |
| `useNavigate` | `useNavigate` | Similar API, accepts optional `addToHistory` parameter |
| `useLocation` | `useLocation` | Basic pathname support |
| Nested routes | Nested routes | Full support with automatic level detection |
| Index routes | Index routes | Via `index: true` |
| History navigation | History navigation | `goBack()`, `goForward()`, `canGoBack()`, `canGoForward()` via `useRouteInfo()` |

### Unsupported Features

| React Router Feature | Status | Workaround |
|---------------------|--------|------------|
| `useParams` | Not implemented | Manual path parsing |
| `useSearchParams` | Not implemented | Manual query string parsing |
| Route loaders | Not implemented | Use `useEffect` in components |
| Route actions | Not implemented | Handle in components |
| Error boundaries | Not implemented | Use React error boundaries |
| Suspense integration | Not implemented | Handle loading states manually |

## Common Migration Patterns

### 1. Protected Routes

**Before (React Router):**
```tsx
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  return auth.user ? children : <Navigate to="/login" />;
};

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

**After (KeepAliveRouter):**
```tsx
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  return auth.user ? children : <Navigate to="/login" />;
};

// In route configuration
{
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

### 2. Layout Routes

**Before (React Router):**
```tsx
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
</Route>

// In AdminLayout.tsx
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="admin-layout">
    <AdminSidebar />
    <main>
      <Outlet /> {/* Child routes render here */}
    </main>
  </div>
);
```

**After (KeepAliveRouter):**
```tsx
// Route configuration
{
  path: '/admin',
  component: AdminLayout,
  children: [
    { path: '', component: AdminDashboard, index: true },
    { path: 'users', component: UserManagement }
  ]
}

// In AdminLayout.tsx
import { KeepAliveOutlet } from './keepaliverouter';

const AdminLayout = () => (
  <div className="admin-layout">
    <AdminSidebar />
    <main>
      <KeepAliveOutlet /> {/* Child routes render here */}
    </main>
  </div>
);
```

### 3. Route Parameters (Manual Implementation)

**Before (React Router):**
```tsx
// Route: /users/:id
const UserProfile = () => {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
};
```

**After (KeepAliveRouter):**
```tsx
// Manual parameter extraction
const UserProfile = () => {
  const { pathname } = useLocation();
  const id = pathname.split('/').pop(); // Simple extraction
  return <div>User ID: {id}</div>;
};

// Or create a custom hook
const useParams = () => {
  const { pathname } = useLocation();
  // Implement your parameter parsing logic
  return extractParams(pathname);
};
```

## Performance Considerations

### Memory Usage

**React Router:**
- Only active route components are mounted
- Lower memory usage
- Components re-initialize on each visit

**KeepAliveRouter:**
- All visited routes stay mounted
- Higher memory usage
- Components maintain state across visits

### When to Use KeepAliveRouter

**Good for:**
- Form-heavy applications
- Editor interfaces
- Dashboard applications
- Any app where state preservation is crucial

**Consider React Router for:**
- Simple websites
- Memory-constrained environments
- Applications with many routes
- SEO-critical applications

## Migration Checklist

### Phase 1: Basic Migration
- [ ] Replace `BrowserRouter` with `KeepAliveRouterProvider`
- [ ] Convert `Routes`/`Route` to `createRoutes` configuration
- [ ] Replace `Outlet` with `KeepAliveOutlet`
- [ ] Update `Link` and `NavLink` usage
- [ ] Test basic navigation

### Phase 2: Advanced Features
- [ ] Migrate nested routes
- [ ] Handle redirects
- [ ] Update protected routes
- [ ] Implement custom parameter parsing if needed
- [ ] Test all navigation flows

### Phase 3: Optimization
- [ ] Review component lifecycle effects
- [ ] Optimize for keep-alive behavior
- [ ] Add proper cleanup in `useEffect`
- [ ] Test memory usage
- [ ] Performance testing

## Troubleshooting

### Common Issues

1. **Components not re-rendering on route change**
   - Check if you're using `KeepAliveOutlet` instead of manual rendering
   - Ensure route paths match exactly

2. **Memory leaks**
   - Add proper cleanup in `useEffect` hooks
   - Avoid creating unnecessary subscriptions

3. **State not persisting**
   - Verify components are being kept alive (check DOM)
   - Ensure you're not recreating component instances

4. **URL not updating**
   - Check browser history integration
   - Verify route paths in configuration

### Getting Help

If you encounter issues during migration:

1. Check the component is properly mounted in KeepAliveOutlet
2. Verify route configuration matches expected paths
3. Test with simple routes first, then add complexity
4. Use browser DevTools to inspect mounted components

## Best Practices

### 1. Component Design for Keep-Alive
```tsx
const MyComponent = () => {
  useEffect(() => {
    // Setup that should only run once
    const subscription = setupSubscription();
    
    return () => {
      // Cleanup when component finally unmounts
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array for one-time setup

  useEffect(() => {
    // Logic that should run when route becomes active
    if (isActive) {
      refreshData();
    }
  }, [isActive]);
};
```

### 2. Memory Management
```tsx
const DataHeavyComponent = () => {
  const [data, setData] = useState([]);
  const isActive = useIsActive('/data-heavy');

  useEffect(() => {
    // Clear heavy data when route is not active
    if (!isActive) {
      setData([]); // Free memory
    } else {
      loadData().then(setData);
    }
  }, [isActive]);
};
```

### 3. History Navigation
```tsx
const NavigationControls = () => {
  const { goBack, goForward, canGoBack, canGoForward, history, historyIndex } = useRouteInfo();
  
  return (
    <div>
      <button onClick={goBack} disabled={!canGoBack()}>
        Back
      </button>
      <button onClick={goForward} disabled={!canGoForward()}>
        Forward
      </button>
      <div>History: {history.length} entries, current: {historyIndex}</div>
    </div>
  );
};
```

### 4. Navigation Without History
```tsx
const navigate = useNavigate();

// Navigate without adding to history (replace current entry)
const handleRedirect = () => {
  navigate('/login', false);
};
```

This migration guide should help you transition from React Router to KeepAliveRouter while understanding the trade-offs and benefits of the keep-alive approach.
