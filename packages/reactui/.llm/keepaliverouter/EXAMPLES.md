# KeepAliveRouter Examples

## Basic Setup

### Simple Application with Keep-Alive Routing

```tsx
import React from 'react';
import { 
  KeepAliveRouterProvider, 
  KeepAliveOutlet, 
  createRoutes,
  Link 
} from './keepaliverouter';

// Define your page components
const HomePage = () => (
  <div className="p-6">
    <h1>Home Page</h1>
    <p>This is the home page content.</p>
  </div>
);

const AboutPage = () => (
  <div className="p-6">
    <h1>About Page</h1>
    <p>This is the about page content.</p>
  </div>
);

// Create route configuration
const routes = createRoutes([
  {
    path: '/',
    component: HomePage,
    title: 'Home'
  },
  {
    path: '/about',
    component: AboutPage,
    title: 'About'
  }
]);

// Main App component
function App() {
  return (
    <KeepAliveRouterProvider routes={routes} initialRoute="/">
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm p-4">
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800"
              activeClassName="font-bold text-blue-800"
            >
              Home
            </Link>
            <Link 
              to="/about"
              className="text-blue-600 hover:text-blue-800"
              activeClassName="font-bold text-blue-800"
            >
              About
            </Link>
          </div>
        </nav>
        
        {/* Route content */}
        <main>
          <KeepAliveOutlet />
        </main>
      </div>
    </KeepAliveRouterProvider>
  );
}

export default App;
```

## Nested Routes

### Dashboard with Nested Pages

```tsx
import React from 'react';
import { 
  KeepAliveRouterProvider, 
  KeepAliveOutlet, 
  createRoutes,
  Link,
  useCurrentRoute
} from './keepaliverouter';

// Dashboard layout component
const DashboardLayout = () => {
  const currentRoute = useCurrentRoute();
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/dashboard"
            className="block px-4 py-2 hover:bg-gray-700"
            activeClassName="bg-gray-700 font-semibold"
          >
            Overview
          </Link>
          <Link
            to="/dashboard/analytics"
            className="block px-4 py-2 hover:bg-gray-700"
            activeClassName="bg-gray-700 font-semibold"
          >
            Analytics
          </Link>
          <Link
            to="/dashboard/settings"
            className="block px-4 py-2 hover:bg-gray-700"
            activeClassName="bg-gray-700 font-semibold"
          >
            Settings
          </Link>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6">
        <KeepAliveOutlet />
      </main>
    </div>
  );
};

// Dashboard pages
const DashboardOverview = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Total Users</h3>
        <p className="text-2xl">1,234</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Revenue</h3>
        <p className="text-2xl">$12,345</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Orders</h3>
        <p className="text-2xl">567</p>
      </div>
    </div>
  </div>
);

const DashboardAnalytics = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
    <div className="bg-white p-6 rounded shadow">
      <p>Analytics charts and data would go here...</p>
    </div>
  </div>
);

const DashboardSettings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <div className="bg-white p-6 rounded shadow">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Site Name</label>
          <input 
            type="text" 
            className="mt-1 block w-full border rounded px-3 py-2"
            defaultValue="My Dashboard"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input 
            type="email" 
            className="mt-1 block w-full border rounded px-3 py-2"
            defaultValue="admin@example.com"
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  </div>
);

// Route configuration with nested routes
const routes = createRoutes([
  {
    path: '/',
    redirectTo: '/dashboard',
    index: true
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    title: 'Dashboard',
    children: [
      {
        path: '', // Empty path = index route
        component: DashboardOverview,
        index: true,
        title: 'Dashboard Overview'
      },
      {
        path: 'analytics',
        component: DashboardAnalytics,
        title: 'Analytics'
      },
      {
        path: 'settings',
        component: DashboardSettings,
        title: 'Settings'
      }
    ]
  }
]);

function App() {
  return (
    <KeepAliveRouterProvider routes={routes} initialRoute="/dashboard">
      <KeepAliveOutlet />
    </KeepAliveRouterProvider>
  );
}
```

## Programmatic Navigation

### Form with Navigation

```tsx
import React, { useState } from 'react';
import { 
  useNavigate, 
  useRouteInfo,
  KeepAliveRouterProvider,
  KeepAliveOutlet,
  createRoutes
} from './keepaliverouter';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { goBack, canGoBack } = useRouteInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack()}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Welcome to Dashboard!</h1>
    <p>You have successfully logged in.</p>
  </div>
);

const routes = createRoutes([
  { path: '/login', component: LoginForm, title: 'Login' },
  { path: '/dashboard', component: Dashboard, title: 'Dashboard' }
]);
```

## State Preservation Example

### Editor with Unsaved Changes

```tsx
import React, { useState } from 'react';
import { 
  KeepAliveRouterProvider,
  KeepAliveOutlet,
  createRoutes,
  Link,
  useNavigate
} from './keepaliverouter';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Simulate saving
    console.log('Saving code:', code);
    setHasUnsavedChanges(false);
    alert('Code saved successfully!');
  };

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      const shouldLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!shouldLeave) return;
    }
    // Navigate with history (default behavior)
    navigate(path, true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Editor Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Code Editor</h1>
          {hasUnsavedChanges && (
            <span className="text-yellow-400 text-sm">● Unsaved changes</span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => handleNavigation('/preview')}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Preview
          </button>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-full h-full font-mono text-sm border rounded p-4 resize-none"
          placeholder="Write your code here..."
        />
      </div>
    </div>
  );
};

const PreviewPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Code Preview</h1>
        <button
          onClick={() => navigate('/editor')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Editor
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <p>Your code preview would appear here...</p>
        <p className="text-sm text-gray-600 mt-2">
          Note: When you return to the editor, your unsaved changes will still be there!
        </p>
      </div>
    </div>
  );
};

const routes = createRoutes([
  { path: '/', redirectTo: '/editor' },
  { path: '/editor', component: CodeEditor, title: 'Code Editor' },
  { path: '/preview', component: PreviewPage, title: 'Preview' }
]);

function App() {
  return (
    <KeepAliveRouterProvider routes={routes} initialRoute="/editor">
      <KeepAliveOutlet />
    </KeepAliveRouterProvider>
  );
}
```

## Advanced Route Configuration

### Using RouteBuilder for Complex Routes

```tsx
import { RouteBuilder, route, createRoutes } from './keepaliverouter';

// Using RouteBuilder class
const adminRoute = RouteBuilder.create()
  .path('/admin')
  .component(AdminLayout)
  .title('Administration')
  .children([
    {
      path: '',
      component: AdminDashboard,
      index: true,
      title: 'Admin Dashboard'
    },
    {
      path: 'users',
      component: UserManagement,
      title: 'User Management'
    },
    {
      path: 'settings',
      component: AdminSettings,
      title: 'Admin Settings'
    }
  ])
  .build();

// Using convenience function
const profileRoute = route()
  .path('/profile')
  .component(ProfilePage)
  .title('User Profile')
  .build();

// Redirect route
const homeRedirect = route()
  .path('/')
  .redirectTo('/dashboard')
  .build();

// Combining all routes
const appRoutes = [
  homeRedirect,
  adminRoute,
  profileRoute,
  ...createRoutes([
    {
      path: '/dashboard',
      component: Dashboard,
      title: 'Dashboard'
    }
  ])
];
```

## Navigation Components

### Custom Navigation with Active States

```tsx
import React from 'react';
import { NavLink, useIsActive, useCurrentRoute } from './keepaliverouter';

const Navigation = () => {
  const currentRoute = useCurrentRoute();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/team', label: 'Team', icon: '👥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center space-x-2 py-4 text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-colors"
              activeClassName="text-blue-600 border-blue-600 font-semibold"
            >
              {({ isActive }) => (
                <>
                  <span className={`text-lg ${isActive ? 'animate-pulse' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && <span className="text-xs">●</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* Current route indicator */}
      <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600">
        Current route: <code>{currentRoute}</code>
      </div>
    </nav>
  );
};
```

## Error Handling and Guards

### Route Protection Example

```tsx
import React from 'react';
import { Navigate, useCurrentRoute } from './keepaliverouter';

// Simple auth context (implementation not shown)
const useAuth = () => {
  const [isAuthenticated] = useState(false); // This would come from your auth system
  return { isAuthenticated };
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Usage in route configuration
const routes = createRoutes([
  {
    path: '/login',
    component: LoginPage,
    title: 'Login'
  },
  {
    path: '/dashboard',
    component: () => (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    title: 'Dashboard'
  }
]);
```

These examples demonstrate the key features and usage patterns of the KeepAliveRouter module. The keep-alive functionality ensures that component state is preserved across navigation, making it ideal for applications with complex forms, editors, or any scenario where maintaining state is important.
