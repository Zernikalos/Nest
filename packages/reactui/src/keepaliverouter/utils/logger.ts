import { createLogger, LogLevel } from '../../logger';

// Single logger instance for the router
export const routerLogger = createLogger('keepalive:router');

// Helper function to log route changes
export const logRouteChange = (from: string, to: string, context?: string) => {
    routerLogger.info(`Route change: ${from} → ${to}`, { from, to, context });
};

// Track previous route states to avoid duplicate logs
const routeStates = new Map<string, string>();

// Helper function to log route mounting/unmounting
export const logRouteMounting = (route: string, action: 'mount' | 'unmount' | 'render' | 'hide') => {
    const previousState = routeStates.get(route);
    
    // Only log if the state actually changed
    if (previousState !== action) {
        routerLogger.debug(`Route ${action}`, { route, action, previousState });
        routeStates.set(route, action);
    }
};

// Helper function to log router state changes
export const logRouterState = (state: any, context?: string) => {
    routerLogger.debug(`State update`, { context, state });
};

// Helper function to log errors - now simplified thanks to automatic error detection
// Supports both old signature (context, error) and new signature (message, error?, context?)
export const logError = (messageOrContext: string, errorOrMessage?: any, context?: any) => {
    // If second arg is an Error, use old signature: (context, error)
    if (errorOrMessage instanceof Error) {
        routerLogger.error(`Error occurred`, { context: messageOrContext }, errorOrMessage);
    } else {
        // New signature: (message, error?, context?)
        routerLogger.error(messageOrContext, context, errorOrMessage);
    }
};

// Helper to set log level for router
export const setRouterLogLevel = (level: LogLevel) => {
    routerLogger.setLevel(level);
};


