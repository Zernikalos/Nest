# KeepAliveRouter Debugging Guide

## Overview

The KeepAliveRouter includes a logging system using a custom logger that provides detailed logging for router operations, navigation events, and state changes.

## Quick Start

### Setting Log Level

The router uses a custom logger instance. You can control the log level programmatically:

```typescript
import { setRouterLogLevel } from './keepaliverouter';

// Set log level
setRouterLogLevel('debug');  // 'error' | 'warn' | 'info' | 'debug'
```

### Available Log Levels

- `'error'` - Only errors
- `'warn'` - Warnings and errors
- `'info'` - Info, warnings, and errors (default)
- `'debug'` - All log levels (most verbose)

## Logging Features

### 1. Route Changes
Logs navigation events with context:

- Route transitions (from → to)
- Navigation source (programmatic, browser navigation)
- Route mounting state changes

**Example Output:**
```
[keepalive:router] Route change: /dashboard → /editor { from: '/dashboard', to: '/editor', context: 'navigate' }
[keepalive:router] Navigation completed { from: '/dashboard', to: '/editor' }
```

### 2. Route Mounting
Logs when routes are mounted or rendered:

- Route mount/unmount events
- Route render/hide state changes
- Redirect handling

**Example Output:**
```
[keepalive:router] State update { context: 'route mounted', state: { newlyMounted: '/editor', totalMounted: 2 } }
[keepalive:router] Route render { route: '/editor', action: 'render', previousState: undefined }
```

### 3. Navigation Events
Logs all navigation operations:

- Programmatic navigation via `navigate()`
- Browser back/forward button navigation
- History operations

**Example Output:**
```
[keepalive:router] Route change: /dashboard → /editor { from: '/dashboard', to: '/editor', context: 'navigate' }
[keepalive:router] Route change: /editor → /dashboard { from: '/editor', to: '/dashboard', context: 'browser navigation' }
```

## Programmatic Control

### Setting Log Level

```typescript
import { setRouterLogLevel, routerLogger } from './keepaliverouter';

// Set log level programmatically
setRouterLogLevel('debug');

// Use logger directly (if needed)
routerLogger.info('Custom message', { data: 'value' });
routerLogger.debug('Debug message', { details: 'info' });
routerLogger.warn('Warning message', { issue: 'description' });
routerLogger.error('Error message', { error: errorObject });
```

### Logger API

The `routerLogger` instance provides standard logging methods:

```typescript
routerLogger.error(message, data?);
routerLogger.warn(message, data?);
routerLogger.info(message, data?);
routerLogger.debug(message, data?);
```

## Logging Features

### Smart Logging
- **State change detection**: Only logs when route states actually change
- **Duplicate prevention**: Avoids logging the same state multiple times
- **Context awareness**: Provides context for why events occurred

### Helper Functions

The router provides helper functions for common logging scenarios:

```typescript
import { logRouteChange, logRouteMounting, logRouterState, logError } from './keepaliverouter/utils/logger';

// Log route changes
logRouteChange('/dashboard', '/editor', 'navigate');

// Log route mounting
logRouteMounting('/editor', 'render');

// Log router state
logRouterState({ mountedRoutes: 3 }, 'state update');

// Log errors
logError('Navigation error', errorObject);
```

## Debugging Workflows

### 1. Navigation Issues
Set log level to debug and look for:
- Route change events
- Navigation completion
- URL updates
- Browser history events

```typescript
setRouterLogLevel('debug');
// Navigate and check console output
```

### 2. Component Rendering Issues
Look for:
- Route render/hide events
- Component mounting states
- Redirect handling
- Route skipping logic

### 3. State Management Issues
Look for:
- State update logs
- Route mounting logs
- History changes

### 4. Error Debugging
Set log level to error to see only errors:
```typescript
setRouterLogLevel('error');
```

## Advanced Debugging

### Custom Logging in Components
You can use the router logger in your components:

```typescript
import { routerLogger } from './keepaliverouter';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    routerLogger.info('Navigating to editor');
    navigate('/editor');
  };
  
  return <button onClick={handleClick}>Go to Editor</button>;
};
```

### Performance Monitoring
Monitor router performance in your components:

```typescript
const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    const startTime = performance.now();
    navigate('/editor');
    
    // Log navigation timing
    requestAnimationFrame(() => {
      const duration = performance.now() - startTime;
      routerLogger.debug('Navigation timing', { duration: `${duration.toFixed(2)}ms` });
    });
  };
  
  return <button onClick={handleNavigation}>Navigate</button>;
};
```

## Troubleshooting

### Logs Not Appearing
1. **Check log level**: Ensure log level is set appropriately (use 'debug' for all logs)
2. **Check console**: Look for logger initialization
3. **Verify logger import**: Ensure you're importing from the correct path

### Too Much Log Output
1. **Increase log level**: Use 'warn' or 'error' to reduce output
2. **Filter in console**: Use browser console filtering
3. **Use specific log levels**: Only log what you need

### Missing Log Output
1. **Set log level**: Call `setRouterLogLevel('debug')` to enable all logs
2. **Check logger instance**: Verify routerLogger is properly initialized
3. **Check browser console**: Ensure console is not filtered

## Integration with Development Tools

### Browser DevTools
- Log output appears in browser console
- Use console filtering to focus on specific log levels
- Leverage console grouping for complex debugging sessions

### VS Code Integration
- Use console.log() statements in conjunction with router logging
- Set breakpoints in router code for detailed inspection
- Use React DevTools to inspect router state

### Performance Profiling
- Use browser Performance tab to monitor navigation
- Monitor memory usage with keep-alive components
- Profile navigation performance with React DevTools

## Best Practices

### 1. Set Appropriate Log Level
```typescript
// Development: Use debug level
setRouterLogLevel('debug');

// Production: Use error level only
setRouterLogLevel('error');
```

### 2. Use Context Information
Log messages include context about why events occurred - pay attention to the context data.

### 3. Monitor State Changes
Watch for state update logs to understand route mounting behavior.

### 4. Clean Up Production Code
Set log level to 'error' in production to minimize console output.

### 5. Document Debug Sessions
When filing issues, include relevant log output to help with troubleshooting.

## Log Output Examples

### Typical Navigation Flow
```
[keepalive:router] Route change: /dashboard → /editor { from: '/dashboard', to: '/editor', context: 'navigate' }
[keepalive:router] State update { context: 'route mounted', state: { newlyMounted: '/editor', totalMounted: 3 } }
[keepalive:router] Navigation completed { from: '/dashboard', to: '/editor' }
[keepalive:router] Route render { route: '/editor', action: 'render' }
```

### First-Time Route Visit
```
[keepalive:router] Route change: / → /settings { from: '/', to: '/settings', context: 'navigate' }
[keepalive:router] State update { context: 'route mounted', state: { newlyMounted: '/settings', totalMounted: 2 } }
[keepalive:router] Navigation completed { from: '/', to: '/settings' }
[keepalive:router] Route render { route: '/settings', action: 'render' }
```

### Browser Navigation (Back Button)
```
[keepalive:router] Route change: /editor → /dashboard { from: '/editor', to: '/dashboard', context: 'browser navigation' }
[keepalive:router] Navigation completed { from: '/editor', to: '/dashboard' }
[keepalive:router] Route render { route: '/dashboard', action: 'render' }
```
