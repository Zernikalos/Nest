# KeepAliveRouter Best Practices

## Component Design Patterns

### 1. Lifecycle-Aware Components

Design components that work well with keep-alive behavior:

```tsx
import { useIsActive } from './keepaliverouter';

const DataDashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isActive = useIsActive('/dashboard');

  // One-time setup (runs only on first mount)
  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    
    return () => {
      eventSource.close(); // Cleanup on unmount
    };
  }, []);

  // Active route behavior
  useEffect(() => {
    if (isActive) {
      // Refresh data when route becomes active
      refreshData();
      
      // Start periodic updates
      const interval = setInterval(refreshData, 30000);
      
      return () => {
        clearInterval(interval); // Stop updates when inactive
      };
    }
  }, [isActive]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const newData = await fetchDashboardData();
      setData(newData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {/* Dashboard content */}
    </div>
  );
};
```

### 2. Memory-Conscious Components

Implement smart memory management for heavy components:

```tsx
const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const isActive = useIsActive('/gallery');

  useEffect(() => {
    if (isActive) {
      // Load full images when active
      loadFullImages();
    } else {
      // Keep only thumbnails when inactive to save memory
      setImages([]);
      if (thumbnails.length === 0) {
        loadThumbnails();
      }
    }
  }, [isActive]);

  const loadFullImages = async () => {
    const fullImages = await fetchFullImages();
    setImages(fullImages);
  };

  const loadThumbnails = async () => {
    const thumbs = await fetchThumbnails();
    setThumbnails(thumbs);
  };

  return (
    <div>
      {isActive ? (
        <FullImageGallery images={images} />
      ) : (
        <ThumbnailGallery thumbnails={thumbnails} />
      )}
    </div>
  );
};
```

### 3. Form State Management

Handle forms that need to persist data across navigation:

```tsx
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  // Warn before navigation if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [hasUnsavedChanges]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    await saveForm(formData);
    setHasUnsavedChanges(false);
  };

  const handleNavigation = (path) => {
    if (hasUnsavedChanges) {
      const shouldLeave = confirm('You have unsaved changes. Continue?');
      if (!shouldLeave) return;
    }
    navigate(path);
  };

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Name"
      />
      {/* More form fields */}
      
      <div className="form-actions">
        <button type="button" onClick={handleSave}>
          Save {hasUnsavedChanges && '*'}
        </button>
        <button 
          type="button" 
          onClick={() => handleNavigation('/dashboard')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
```

## Route Configuration Best Practices

### 1. Organized Route Structure

Structure routes in a maintainable way:

```tsx
// routes/index.ts
import { createRoutes } from '../keepaliverouter';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { settingsRoutes } from './settings';

export const appRoutes = createRoutes([
  // Root redirect
  {
    path: '/',
    redirectTo: '/dashboard',
    index: true
  },
  
  // Main application routes
  ...dashboardRoutes,
  ...settingsRoutes,
  ...authRoutes,
  
  // Catch-all route
  {
    path: '*',
    component: NotFoundPage,
    title: 'Page Not Found'
  }
]);

// routes/dashboard.ts
export const dashboardRoutes = createRoutes([
  {
    path: '/dashboard',
    component: DashboardLayout,
    title: 'Dashboard',
    children: [
      {
        path: '',
        component: DashboardHome,
        index: true,
        title: 'Dashboard Home'
      },
      {
        path: 'analytics',
        component: AnalyticsPage,
        title: 'Analytics'
      },
      {
        path: 'reports',
        component: ReportsPage,
        title: 'Reports'
      }
    ]
  }
]);
```

### 2. Route Metadata Usage

Leverage route metadata for better UX:

```tsx
const routes = createRoutes([
  {
    path: '/editor',
    component: CodeEditor,
    title: 'Code Editor',
    meta: {
      requiresAuth: true,
      showInNav: true,
      icon: 'code',
      shortcut: 'Ctrl+E'
    }
  }
]);

// Use metadata in navigation
const Navigation = () => {
  const routes = useRoutes();
  
  const navRoutes = routes.filter(route => route.meta?.showInNav);
  
  return (
    <nav>
      {navRoutes.map(route => (
        <NavLink key={route.path} to={route.path}>
          <Icon name={route.meta.icon} />
          {route.title}
          {route.meta.shortcut && (
            <kbd>{route.meta.shortcut}</kbd>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
```

## Performance Optimization

### 1. Selective Component Mounting

Only mount expensive components when needed:

```tsx
const ExpensiveChart = React.lazy(() => import('./ExpensiveChart'));

const DashboardPage = () => {
  const isActive = useIsActive('/dashboard');
  const [shouldLoadChart, setShouldLoadChart] = useState(false);

  useEffect(() => {
    if (isActive && !shouldLoadChart) {
      // Delay loading expensive component
      const timer = setTimeout(() => {
        setShouldLoadChart(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div>
      <h1>Dashboard</h1>
      
      {shouldLoadChart && isActive && (
        <Suspense fallback={<ChartSkeleton />}>
          <ExpensiveChart />
        </Suspense>
      )}
    </div>
  );
};
```

### 2. Memory Cleanup Strategies

Implement cleanup for heavy resources:

```tsx
const VideoPlayer = () => {
  const videoRef = useRef();
  const isActive = useIsActive('/video');

  useEffect(() => {
    if (!isActive && videoRef.current) {
      // Pause and cleanup when not active
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      
      // Free video memory
      videoRef.current.src = '';
      videoRef.current.load();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      controls
      onLoadedData={() => {
        if (isActive) {
          videoRef.current.play();
        }
      }}
    />
  );
};
```

### 3. State Optimization

Optimize state updates for inactive routes:

```tsx
const LiveDataComponent = () => {
  const [data, setData] = useState([]);
  const isActive = useIsActive('/live-data');
  const updateFrequency = isActive ? 1000 : 10000; // Slower updates when inactive

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isActive || data.length === 0) {
        const newData = await fetchLiveData();
        setData(newData);
      }
    }, updateFrequency);

    return () => clearInterval(interval);
  }, [isActive, updateFrequency]);

  return (
    <div>
      <div className={`status ${isActive ? 'live' : 'paused'}`}>
        {isActive ? 'Live Updates' : 'Paused'}
      </div>
      {/* Data display */}
    </div>
  );
};
```

## Error Handling and Edge Cases

### 1. Route Error Boundaries

Implement error boundaries for robust routing:

```tsx
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route error:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap routes with error boundary
const SafeRoute = ({ component: Component }) => (
  <RouteErrorBoundary>
    <Component />
  </RouteErrorBoundary>
);
```

### 2. Loading States

Handle loading states gracefully:

```tsx
const AsyncDataPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isActive = useIsActive('/data');

  useEffect(() => {
    if (isActive && !data) {
      loadData();
    }
  }, [isActive]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={loadData} />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
};
```

## Testing Strategies

### 1. Component Testing with Keep-Alive

Test components considering keep-alive behavior:

```tsx
import { render, screen } from '@testing-library/react';
import { KeepAliveRouterProvider, createRoutes } from '../keepaliverouter';

const TestWrapper = ({ children, routes, initialRoute = '/' }) => (
  <KeepAliveRouterProvider routes={routes} initialRoute={initialRoute}>
    {children}
  </KeepAliveRouterProvider>
);

describe('KeepAlive Component Behavior', () => {
  test('component state persists across navigation', async () => {
    const routes = createRoutes([
      { path: '/', component: HomePage },
      { path: '/form', component: FormPage }
    ]);

    const { navigate } = render(
      <TestWrapper routes={routes}>
        <KeepAliveOutlet />
      </TestWrapper>
    );

    // Navigate to form, fill data
    navigate('/form');
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test data' } });

    // Navigate away and back
    navigate('/');
    navigate('/form');

    // Data should still be there
    expect(input.value).toBe('test data');
  });
});
```

### 2. Navigation Testing

Test navigation flows:

```tsx
describe('Navigation', () => {
  test('programmatic navigation works', () => {
    const TestComponent = () => {
      const navigate = useNavigate();
      return (
        <button onClick={() => navigate('/target')}>
          Navigate
        </button>
      );
    };

    render(
      <TestWrapper routes={testRoutes}>
        <TestComponent />
        <KeepAliveOutlet />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Navigate'));
    expect(screen.getByText('Target Page')).toBeInTheDocument();
  });
});
```

## Common Anti-Patterns

### ❌ Don't: Recreate Components

```tsx
// Bad: Creates new component instance each time
const BadRoute = () => {
  const MyComponent = () => <div>Content</div>; // New instance every render
  return <MyComponent />;
};
```

### ✅ Do: Stable Component References

```tsx
// Good: Stable component reference
const MyComponent = () => <div>Content</div>;

const GoodRoute = () => {
  return <MyComponent />;
};
```

### ❌ Don't: Ignore Cleanup

```tsx
// Bad: No cleanup leads to memory leaks
const BadComponent = () => {
  useEffect(() => {
    const subscription = subscribe();
    // Missing cleanup!
  }, []);
};
```

### ✅ Do: Proper Cleanup

```tsx
// Good: Proper cleanup
const GoodComponent = () => {
  useEffect(() => {
    const subscription = subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
```

### ❌ Don't: Ignore Active State

```tsx
// Bad: Always running expensive operations
const BadComponent = () => {
  useEffect(() => {
    const interval = setInterval(expensiveOperation, 1000);
    return () => clearInterval(interval);
  }, []);
};
```

### ✅ Do: Respect Active State

```tsx
// Good: Only run when route is active
const GoodComponent = () => {
  const isActive = useIsActive('/path');
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(expensiveOperation, 1000);
    return () => clearInterval(interval);
  }, [isActive]);
};
```

## Monitoring and Debugging

### 1. Route State Monitoring

Add debugging utilities:

```tsx
const RouteDebugger = () => {
  const { currentRoute, mountedRoutes } = useKeepAliveRouter();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-2 text-xs">
      <div>Current: {currentRoute}</div>
      <div>Mounted: {Array.from(mountedRoutes).join(', ')}</div>
      <div>Memory: {(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB</div>
    </div>
  );
};
```

### 2. Performance Monitoring

Track performance metrics:

```tsx
const useRoutePerformance = () => {
  const { currentRoute } = useKeepAliveRouter();
  
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Route ${currentRoute} was active for ${endTime - startTime}ms`);
    };
  }, [currentRoute]);
};
```

These best practices will help you build robust, performant applications with KeepAliveRouter while avoiding common pitfalls and memory issues.
