import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { routerLogger, logRouteChange, logRouterState } from './logger';
import { normalizePath, joinPaths, splitPath, isExactMatch, getParentPaths } from './routeUtils';

// Types for our custom router
export interface Route {
    path: string;
    component?: React.ComponentType;
    title?: string;
    children?: Route[];
    index?: boolean;
    redirectTo?: string;
    level?: number; // level of the route in the hierarchy
    originalPath?: string; // original path of the route
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

    // Simplified route flattening function using routeUtils
    const flattenRoutes = (routes: Route[], parentPath = '', level = 0): Route[] => {
        const flattened: Route[] = [];
        
        for (const route of routes) {
            // Handle empty path (index routes) - use parentPath directly
            let fullPath: string;
            if (!route.path || route.path === '') {
                // Index route: use parent path as-is
                fullPath = parentPath || '/';
            } else if (parentPath) {
                // Child route: join with parent and normalize to ensure leading slash
                fullPath = normalizePath(joinPaths(parentPath, route.path));
            } else {
                // Root route: normalize
                fullPath = normalizePath(route.path);
            }
            
            // More efficient object creation - only copy necessary properties
            const flattenedRoute: Route = {
                path: fullPath,
                component: route.component,
                title: route.title,
                index: route.index,
                redirectTo: route.redirectTo,
                level,
                originalPath: route.path,
            };
            
            flattened.push(flattenedRoute);
            
            if (route.children) {
                flattened.push(...flattenRoutes(route.children, fullPath, level + 1));
            }
        }
        
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

// Simplified navigation hook
export const useNavigate = () => {
    const { navigate } = useKeepAliveRouter();
    return navigate;
};

// Simplified current route hook
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

    // Memoized navigation function to prevent unnecessary re-renders
    const navigate = useCallback((path: string) => {
        const normalizedPath = normalizePath(path);
        // Early return if navigating to the same route
        if (isExactMatch(normalizedPath, currentRoute)) {
            return;
        }
        
        const previousRoute = currentRoute;
        logRouteChange(previousRoute, normalizedPath, 'navigate');
        
        // More efficient route mounting logic - mount all parent routes too
        setMountedRoutes(prev => {
            const newMounted = new Set(prev);
            const parentPaths = getParentPaths(normalizedPath);
            
            // Mount all parent paths (e.g., for /settings/appearance, mount /settings too)
            for (const parentPath of parentPaths) {
                if (!newMounted.has(parentPath)) {
                    newMounted.add(parentPath);
                    logRouterState({ newlyMounted: parentPath, totalMounted: newMounted.size }, 'route mounted');
                }
            }
            
            return newMounted;
        });
        
        setCurrentRoute(normalizedPath);
        // Log navigation
        routerLogger.info('Navigation completed', { from: previousRoute, to: normalizedPath });
    }, [currentRoute]);

    // Memoized route checking function
    const isRouteActive = useCallback((path: string) => currentRoute === path, [currentRoute]);

    // Memoized functions to get routes for specific levels
    const getRoutesForLevel = useCallback((level: number): Route[] => {
        return flatRoutes.filter(route => route.level === level);
    }, [flatRoutes]);

    // Memoized function to get route level
    const getRouteLevel = useCallback((path: string): number => {
        const route = flatRoutes.find(r => r.path === path);
        return route?.level ?? 0;
    }, [flatRoutes]);

    // Memoized function to get current route segments
    const getCurrentRouteSegments = useCallback((): string[] => {
        return splitPath(currentRoute);
    }, [currentRoute]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            logRouteChange(currentRoute, currentPath, 'browser navigation');
            navigate(currentPath);
        };

        window.addEventListener('popstate', handlePopState);
        
        // Set initial URL
        if (window.location.pathname !== currentRoute) {
            window.history.replaceState(null, '', currentRoute);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Update URL when route changes
    useEffect(() => {
        if (window.location.pathname !== currentRoute) {
            window.history.pushState(null, '', currentRoute);
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
