import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { routerLogger, logRouteChange, logRouterState } from './logger';

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

    // Simplified route flattening function
    const flattenRoutes = (routes: Route[], parentPath = '', level = 0): Route[] => {
        const flattened: Route[] = [];
        
        for (const route of routes) {
            // Simplified path construction
            const fullPath = !parentPath ? route.path : 
                            route.path === '' ? parentPath : 
                            `${parentPath}/${route.path}`;
            
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
        // Early return if navigating to the same route
        if (path === currentRoute) {
            return;
        }
        
        const previousRoute = currentRoute;
        logRouteChange(previousRoute, path, 'navigate');
        
        // More efficient route mounting logic
        setMountedRoutes(prev => {
            if (prev.has(path)) {
                return prev; // No need to create new Set if route already mounted
            }
            // Log route mounting
            logRouterState({ newlyMounted: path, totalMounted: prev.size + 1 }, 'route mounted');
            return new Set([...prev, path]);
        });
        
        setCurrentRoute(path);
        // Log navigation
        routerLogger.info('Navigation completed', { from: previousRoute, to: path });
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
        return currentRoute.split('/').filter(segment => segment !== '');
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
