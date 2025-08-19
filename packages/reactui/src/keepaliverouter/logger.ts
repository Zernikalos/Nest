import debug from 'debug';

// Auto-enable debug in development mode (unless explicitly disabled)
if (import.meta.env.DEV && typeof window !== 'undefined' && !import.meta.env.VITE_DISABLE_ROUTER_DEBUG) {
    // Check if debug is not already set
    const currentDebug = localStorage.getItem('debug');
    if (!currentDebug) {
        localStorage.setItem('debug', 'keepalive:*');
        // Force debug to re-read localStorage
        debug.enabled = () => true;
    }
}

// Create debug instances for different parts of the router
export const routerLogger = debug('keepalive:router');
export const outletLogger = debug('keepalive:outlet');
export const hooksLogger = debug('keepalive:hooks');
export const navigationLogger = debug('keepalive:navigation');

// Helper function to log route changes with context
export const logRouteChange = (from: string, to: string, context?: string) => {
    navigationLogger(`Route change: ${from} → ${to}${context ? ` (${context})` : ''}`);
};

// Track previous route states to avoid duplicate logs
const routeStates = new Map<string, string>();

// Helper function to log route mounting/unmounting
export const logRouteMounting = (route: string, action: 'mount' | 'unmount' | 'render' | 'hide') => {
    const previousState = routeStates.get(route);
    
    // Only log if the state actually changed
    if (previousState !== action) {
        outletLogger(`Route ${action}: ${route}`);
        routeStates.set(route, action);
    }
};

// Helper function to log router state changes
export const logRouterState = (state: any, context?: string) => {
    routerLogger(`State update${context ? ` (${context})` : ''}:`, state);
};

// Helper function to log hook usage
export const logHookUsage = (hookName: string, data?: any) => {
    hooksLogger(`Hook ${hookName} called${data ? ':' : ''}`, data || '');
};

// Helper function to log errors
export const logError = (context: string, error: any) => {
    const errorLogger = debug('keepalive:error');
    errorLogger(`Error in ${context}:`, error);
};

// Helper function to log performance metrics
export const logPerformance = (operation: string, startTime: number) => {
    const perfLogger = debug('keepalive:perf');
    const duration = performance.now() - startTime;
    perfLogger(`${operation} took ${duration.toFixed(2)}ms`);
};

// Helper to enable all router debugging
export const enableRouterDebugging = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('debug', 'keepalive:*');
    } else {
        process.env.DEBUG = 'keepalive:*';
    }
};

// Helper to disable all router debugging
export const disableRouterDebugging = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('debug');
    } else {
        delete process.env.DEBUG;
    }
};
