import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { routerLogger, logRouteChange, logRouterState, logPerformance } from './logger';

// Types for our custom router
export interface Route {
    path: string;
    component?: React.ComponentType;
    title?: string;
    children?: Route[];
    index?: boolean;
    redirectTo?: string;
    level?: number; // Level of nesting for this route
    originalPath?: string; // Original path before flattening (for level calculation)
}

interface KeepAliveRouterContextType {
    currentRoute: string;
    navigate: (path: string) => void;
    routes: Route[];
    flatRoutes: Route[];
    setRoutes: (routes: Route[]) => void;
    isRouteActive: (path: string) => boolean;
    mountedRoutes: Set<string>;
    getRoutesForLevel: (level: number) => Route[];
    getRouteLevel: (path: string) => number;
    getCurrentRouteSegments: () => string[];
}

// Helper function to flatten nested routes
const flattenRoutes = (routes: Route[], parentPath = '', level = 0): Route[] => {
    const startTime = performance.now();
    routerLogger('Flattening routes:', { routeCount: routes.length, parentPath, level });
    
    const flattened: Route[] = [];
    
    for (const route of routes) {
        // Handle path concatenation for nested routes
        let fullPath: string;
        
        if (!parentPath) {
            // Top-level route
            fullPath = route.path;
        } else {
            // Nested route
            if (route.path === '') {
                // Empty path means index route - use parent path
                fullPath = parentPath;
            } else if (route.path.startsWith('/')) {
                // Absolute path - use as is (shouldn't happen in nested routes)
                fullPath = route.path;
            } else {
                // Relative path - combine with parent
                fullPath = `${parentPath}/${route.path}`;
            }
        }
        
        // Add the current route (without children to avoid circular references)
        flattened.push({
            ...route,
            path: fullPath,
            originalPath: route.path,
            level: level,
            children: undefined, // Remove children from flattened route
        });
        
        // Recursively add children
        if (route.children) {
            flattened.push(...flattenRoutes(route.children, fullPath, level + 1));
        }
    }
    
    logPerformance('Route flattening', startTime);
    routerLogger('Flattened routes result:', { flattenedCount: flattened.length, level });
    
    return flattened;
};

// Create context
const KeepAliveRouterContext = createContext<KeepAliveRouterContextType | null>(null);

// Custom hook to use the router
export const useKeepAliveRouter = () => {
    const context = useContext(KeepAliveRouterContext);
    if (!context) {
        throw new Error('useKeepAliveRouter must be used within a KeepAliveRouterProvider');
    }
    return context;
};

// Hook for navigation (similar to useNavigate from react-router)
export const useNavigate = () => {
    const { navigate } = useKeepAliveRouter();
    return navigate;
};

// Hook to get current route
export const useCurrentRoute = () => {
    const { currentRoute } = useKeepAliveRouter();
    return currentRoute;
};

interface KeepAliveRouterProviderProps {
    children: ReactNode;
    initialRoute?: string;
    routes: Route[];
}

export const KeepAliveRouterProvider: React.FC<KeepAliveRouterProviderProps> = ({
    children,
    initialRoute = '/',
    routes: initialRoutes,
}) => {
    const [currentRoute, setCurrentRoute] = useState(initialRoute);
    const [routes, setRoutes] = useState<Route[]>(initialRoutes);
    const [mountedRoutes, setMountedRoutes] = useState<Set<string>>(new Set([initialRoute]));
    
    // Flatten routes to handle nested routes properly
    const flatRoutes = useMemo(() => {
        return flattenRoutes(routes);
    }, [routes]);

    const navigate = (path: string) => {
        const previousRoute = currentRoute;
        logRouteChange(previousRoute, path, 'navigate');
        
        // Add the route to mounted routes if it's not already there
        setMountedRoutes(prev => {
            const newSet = new Set([...prev, path]);
            // Only log if a new route was actually mounted
            if (!prev.has(path)) {
                logRouterState({ newlyMounted: path, totalMounted: newSet.size }, 'route mounted');
            }
            return newSet;
        });
        
        setCurrentRoute(path);
        routerLogger('Navigation completed:', { from: previousRoute, to: path });
    };

    const isRouteActive = (path: string) => {
        return currentRoute === path;
    };

    // Get routes for a specific nesting level
    const getRoutesForLevel = (level: number): Route[] => {
        return flatRoutes.filter(route => route.level === level);
    };

    // Get the nesting level of a specific route path
    const getRouteLevel = (path: string): number => {
        const route = flatRoutes.find(r => r.path === path);
        return route?.level ?? 0;
    };

    // Get current route segments for level calculation
    const getCurrentRouteSegments = (): string[] => {
        return currentRoute.split('/').filter(segment => segment !== '');
    };

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            logRouteChange(currentRoute, currentPath, 'browser navigation');
            navigate(currentPath);
        };

        window.addEventListener('popstate', handlePopState);
        routerLogger('PopState listener attached');
        
        // Set initial URL
        if (window.location.pathname !== currentRoute) {
            window.history.replaceState(null, '', currentRoute);
            routerLogger('Initial URL set:', { url: currentRoute });
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
            routerLogger('PopState listener removed');
        };
    }, []);

    // Update URL when route changes
    useEffect(() => {
        if (window.location.pathname !== currentRoute) {
            window.history.pushState(null, '', currentRoute);
            routerLogger('URL updated via pushState:', { url: currentRoute });
        }
    }, [currentRoute]);

    const contextValue: KeepAliveRouterContextType = {
        currentRoute,
        navigate,
        routes,
        flatRoutes,
        setRoutes,
        isRouteActive,
        mountedRoutes,
        getRoutesForLevel,
        getRouteLevel,
        getCurrentRouteSegments,
    };

    return (
        <KeepAliveRouterContext.Provider value={contextValue}>
            {children}
        </KeepAliveRouterContext.Provider>
    );
};
