# KeepAliveRouter Debugging Guide

## Overview

The KeepAliveRouter includes a comprehensive debugging system using the `debug` library that provides detailed logging for router operations, navigation events, and performance metrics.

## Quick Start

### Auto-Enable in Development
```bash
# Debug is automatically enabled in development mode
pnpm run dev

# Disable debug temporarily
pnpm run dev:no-debug
```

### Manual Control
```bash
# Enable specific debug categories
pnpm run dev:debug:router    # Core router operations
pnpm run dev:debug:outlet    # Component rendering
pnpm run dev:debug:hooks     # Hook usage
pnpm run dev:debug:nav       # Navigation events
```

## Debug Categories

### 1. Router Core (`keepalive:router`)
Logs core router operations and state management:

- Route flattening operations and performance
- Navigation completion events
- URL history management (pushState/replaceState)
- Route mounting state changes
- Browser history integration

**Example Output:**
```
keepalive:router Flattening routes: { routeCount: 4, parentPath: '' }
keepalive:perf Route flattening took 0.23ms
keepalive:router Navigation completed: { from: '/', to: '/editor' }
keepalive:router State update (route mounted): { newlyMounted: '/editor', totalMounted: 2 }
keepalive:router URL updated via pushState: { url: '/editor' }
```

### 2. Outlet Rendering (`keepalive:outlet`)
Logs component mounting, rendering, and visibility changes:

- Route component render/hide state changes
- Redirect handling and resolution
- Route skipping logic (unmounted routes)

**Example Output:**
```
keepalive:outlet Handling redirect: { from: '/', to: '/editor', redirectTo: '/editor' }
keepalive:outlet Route hide: /dashboard
keepalive:outlet Route render: /editor
```

### 3. Navigation (`keepalive:navigation`)
Logs all navigation events with context:

- Programmatic navigation via `navigate()`
- Browser back/forward button navigation
- Route changes with source context

**Example Output:**
```
keepalive:navigation Route change: /dashboard → /editor (navigate)
keepalive:navigation Route change: /editor → /dashboard (browser navigation)
```

### 4. Hooks Usage (`keepalive:hooks`)
Logs router hook usage and parameters:

- Hook calls with parameters and return values
- Navigation utility usage (`goBack`, `goForward`)
- Route information queries

**Example Output:**
```
keepalive:hooks Hook useLocation called: { pathname: '/editor', search: '', hash: '', state: null, key: '/editor' }
keepalive:hooks Hook useIsActive called: { path: '/editor', isActive: true }
keepalive:hooks goBack called
```

### 5. Performance (`keepalive:perf`)
Logs performance metrics for router operations:

- Route flattening timing
- Navigation timing
- Component mounting performance

**Example Output:**
```
keepalive:perf Route flattening took 1.23ms
keepalive:perf Navigation completed in 0.45ms
```

### 6. Errors (`keepalive:error`)
Logs router-related errors with context:

- Navigation errors
- Route configuration errors
- Context usage errors

**Example Output:**
```
keepalive:error Error in navigation: Route '/invalid' not found
```

## Browser Console Control

### Enable/Disable in Browser Console
```javascript
// Enable all router debugging
localStorage.setItem('debug', 'keepalive:*');

// Enable specific categories
localStorage.setItem('debug', 'keepalive:router,keepalive:navigation');

// Enable only navigation
localStorage.setItem('debug', 'keepalive:navigation');

// Disable all debugging
localStorage.removeItem('debug');

// Refresh page to apply changes
location.reload();
```

### Programmatic Control
```typescript
import { enableRouterDebugging, disableRouterDebugging } from './keepaliverouter';

// Enable all router debugging
enableRouterDebugging();

// Disable all router debugging
disableRouterDebugging();
```

## Debug Features

### Smart Logging
- **State change detection**: Only logs when route states actually change
- **Duplicate prevention**: Avoids logging the same state multiple times
- **Context awareness**: Provides context for why events occurred
- **Performance tracking**: Automatic timing of critical operations

### Development vs Production
- **Auto-enable in development**: Debug automatically enabled in dev mode
- **Production safe**: Debug code is stripped in production builds
- **Zero performance impact**: No overhead when debugging is disabled
- **Environment aware**: Respects Vite environment variables

### Configuration Options
```typescript
// Vite environment variables
VITE_DISABLE_ROUTER_DEBUG=true  // Disable auto-enable in development

// Debug library patterns
DEBUG=keepalive:*               // All router debugging
DEBUG=keepalive:router          // Only router core
DEBUG=keepalive:outlet          // Only outlet rendering
DEBUG=keepalive:hooks           // Only hook usage
DEBUG=keepalive:navigation      // Only navigation events
DEBUG=keepalive:perf            // Only performance metrics
DEBUG=keepalive:error           // Only errors
```

## Debugging Workflows

### 1. Navigation Issues
Enable navigation and router debugging:
```bash
pnpm run dev:debug:nav
```
Look for:
- Route change events
- Navigation completion
- URL updates
- Browser history events

### 2. Component Rendering Issues
Enable outlet debugging:
```bash
pnpm run dev:debug:outlet
```
Look for:
- Route render/hide events
- Component mounting states
- Redirect handling
- Route skipping logic

### 3. Performance Issues
Enable performance debugging:
```bash
DEBUG=keepalive:perf pnpm run dev
```
Look for:
- Route flattening timing
- Navigation performance
- Component mounting timing

### 4. Hook Usage Issues
Enable hooks debugging:
```bash
pnpm run dev:debug:hooks
```
Look for:
- Hook call parameters
- Return values
- Navigation utility usage

## Advanced Debugging

### Custom Debug Logging
While internal debug functions are not exposed, you can use the debug library directly in your components:

```typescript
import debug from 'debug';

const myComponentLogger = debug('myapp:component');

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    myComponentLogger('Navigating to editor');
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
      console.log(`Navigation took ${duration.toFixed(2)}ms`);
    });
  };
  
  return <button onClick={handleNavigation}>Navigate</button>;
};
```

## Troubleshooting

### Debug Not Working
1. **Check environment**: Ensure you're in development mode
2. **Clear localStorage**: `localStorage.removeItem('debug')`
3. **Refresh page**: Debug settings require page reload
4. **Check console**: Look for debug initialization messages

### Too Much Debug Output
1. **Use specific categories**: Instead of `keepalive:*`, use specific patterns
2. **Disable verbose categories**: Skip `keepalive:hooks` if too noisy
3. **Use browser filtering**: Filter console output by debug category

### Missing Debug Output
1. **Verify debug is enabled**: Check `localStorage.getItem('debug')`
2. **Check pattern matching**: Ensure debug pattern matches category names
3. **Refresh after changes**: Debug settings require page reload

## Integration with Development Tools

### Browser DevTools
- Debug output appears in browser console with colors
- Use console filtering to focus on specific categories
- Leverage console grouping for complex debugging sessions

### VS Code Integration
- Install "Debug Visualizer" extension for enhanced debug output
- Use console.log() statements in conjunction with debug logging
- Set breakpoints in router code for detailed inspection

### Performance Profiling
- Use browser Performance tab alongside `keepalive:perf` logs
- Monitor memory usage with keep-alive components
- Profile navigation performance with React DevTools

## Best Practices

### 1. Start Broad, Then Narrow
```bash
# Start with all debugging
pnpm run dev:debug

# Then focus on specific issues
pnpm run dev:debug:navigation
```

### 2. Use Context Information
Debug logs include context about why events occurred - pay attention to the context strings.

### 3. Monitor Performance
Keep an eye on `keepalive:perf` logs to ensure router operations remain fast.

### 4. Clean Up Production Code
Debug logging is automatically removed in production, but avoid excessive debug statements in your own code.

### 5. Document Debug Sessions
When filing issues, include relevant debug output to help with troubleshooting.

## Debug Output Examples

### Typical Navigation Flow
```
keepalive:navigation Route change: /dashboard → /editor (navigate) +0ms
keepalive:router State update (route mounted): { newlyMounted: '/editor', totalMounted: 3 } +1ms
keepalive:router Navigation completed: { from: '/dashboard', to: '/editor' } +0ms
keepalive:outlet Route hide: /dashboard +2ms
keepalive:outlet Route render: /editor +0ms
keepalive:router URL updated via pushState: { url: '/editor' } +15ms
```

### First-Time Route Visit
```
keepalive:navigation Route change: / → /settings (navigate) +0ms
keepalive:router State update (route mounted): { newlyMounted: '/settings', totalMounted: 2 } +1ms
keepalive:router Navigation completed: { from: '/', to: '/settings' } +0ms
keepalive:outlet Route hide: / +1ms
keepalive:outlet Route render: /settings +0ms
keepalive:router URL updated via pushState: { url: '/settings' } +12ms
```

### Browser Navigation (Back Button)
```
keepalive:navigation Route change: /editor → /dashboard (browser navigation) +0ms
keepalive:router Navigation completed: { from: '/editor', to: '/dashboard' } +0ms
keepalive:outlet Route hide: /editor +1ms
keepalive:outlet Route render: /dashboard +0ms
```
