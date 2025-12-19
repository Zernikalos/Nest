import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { routerLogger, logRouteChange, logRouterState } from './logger';
import { normalizePath, joinPaths, splitPath, isExactMatch, getParentPaths } from './routeUtils';
import { useRouteHistory } from './routeHistory';

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
    navigate: (path: string, addToHistory?: boolean) => void;
    routes: Route[];
    flatRoutes: Route[];
    setRoutes: (routes: Route[]) => void;
    isRouteActive: (path: string) => boolean;
    mountedRoutes: Set<string>;
    getRoutesForLevel: (level: number) => Route[];
    getRouteLevel: (path: string) => number;
    getCurrentRouteSegments: () => string[];
    goBack: () => void;
    goForward: () => void;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
    history: readonly string[];
    historyIndex: number;
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
    const [routes, setRoutes] = useState<Route[]>(initialRoutes);
    
    // Initialize route history
    const routeHistory = useRouteHistory(initialRoute);
    const currentRoute = routeHistory.currentRoute;
    
    const [mountedRoutes, setMountedRoutes] = useState<Set<string>>(new Set([initialRoute]));
    
    // Sync mountedRoutes when currentRoute changes (from history navigation)
    useEffect(() => {
        setMountedRoutes(prev => {
            const newMounted = new Set(prev);
            const parentPaths = getParentPaths(currentRoute);
            
            // Mount all parent paths for the current route
            let hasChanges = false;
            for (const parentPath of parentPaths) {
                if (!newMounted.has(parentPath)) {
                    newMounted.add(parentPath);
                    hasChanges = true;
                    logRouterState({ newlyMounted: parentPath, totalMounted: newMounted.size }, 'route mounted');
                }
            }
            
            // Only return new Set if there were changes
            return hasChanges ? newMounted : prev;
        });
    }, [currentRoute]);
    
    // Flatten routes to handle nested routes properly
    const flatRoutes = useMemo(() => {
        return flattenRoutes(routes);
    }, [routes]);

    // Memoized navigation function to prevent unnecessary re-renders
    const navigate = useCallback((path: string, addToHistory: boolean = true) => {
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
        
        // Add to history (this will trigger onChange callback and update currentRoute synchronously)
        // The onChange callback will update currentRoute, which will trigger the useEffect to sync mountedRoutes
        routeHistory.add(normalizedPath, addToHistory);
        // Sync URL after adding to history
        routeHistory.syncUrl(normalizedPath);
        
        // Log navigation
        routerLogger.info('Navigation completed', { from: previousRoute, to: normalizedPath });
    }, [currentRoute, routeHistory]);

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

    // History navigation functions
    const goBack = useCallback(() => {
        const previousRoute = routeHistory.goBack();
        if (previousRoute) {
            // Mount routes if needed
            setMountedRoutes(prev => {
                const newMounted = new Set(prev);
                const parentPaths = getParentPaths(previousRoute);
                
                for (const parentPath of parentPaths) {
                    if (!newMounted.has(parentPath)) {
                        newMounted.add(parentPath);
                        logRouterState({ newlyMounted: parentPath, totalMounted: newMounted.size }, 'route mounted');
                    }
                }
                
                return newMounted;
            });
            
            routeHistory.syncUrl(previousRoute);
            logRouteChange(currentRoute, previousRoute, 'goBack');
        }
    }, [currentRoute, routeHistory]);

    const goForward = useCallback(() => {
        const nextRoute = routeHistory.goForward();
        if (nextRoute) {
            // Mount routes if needed
            setMountedRoutes(prev => {
                const newMounted = new Set(prev);
                const parentPaths = getParentPaths(nextRoute);
                
                for (const parentPath of parentPaths) {
                    if (!newMounted.has(parentPath)) {
                        newMounted.add(parentPath);
                        logRouterState({ newlyMounted: parentPath, totalMounted: newMounted.size }, 'route mounted');
                    }
                }
                
                return newMounted;
            });
            
            routeHistory.syncUrl(nextRoute);
            logRouteChange(currentRoute, nextRoute, 'goForward');
        }
    }, [currentRoute, routeHistory]);

    // Handle browser back/forward buttons (synchronization only)
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== currentRoute) {
                logRouteChange(currentRoute, currentPath, 'browser navigation');
                // Sync with history but don't add to history (user used browser buttons)
                const normalizedPath = normalizePath(currentPath);
                
                // Mount routes if needed
                setMountedRoutes(prev => {
                    const newMounted = new Set(prev);
                    const parentPaths = getParentPaths(normalizedPath);
                    
                    for (const parentPath of parentPaths) {
                        if (!newMounted.has(parentPath)) {
                            newMounted.add(parentPath);
                            logRouterState({ newlyMounted: parentPath, totalMounted: newMounted.size }, 'route mounted');
                        }
                    }
                    
                    return newMounted;
                });
                
                // Update history without adding to history
                routeHistory.add(normalizedPath, false);
                routeHistory.syncUrl(normalizedPath);
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        // Set initial URL
        routeHistory.syncUrl(initialRoute);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [currentRoute, routeHistory, initialRoute]);

    // Log current state for debugging
    useEffect(() => {
        routerLogger.info('Router state updated', {
            currentRoute,
            mountedRoutes: Array.from(mountedRoutes),
            history: routeHistory.getHistory(),
            historyIndex: routeHistory.getIndex(),
        });
    }, [currentRoute, mountedRoutes, routeHistory]);

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
        goBack,
        goForward,
        canGoBack: routeHistory.canGoBack,
        canGoForward: routeHistory.canGoForward,
        history: routeHistory.getHistory(),
        historyIndex: routeHistory.getIndex(),
    };

    return (
        <KeepAliveRouterContext.Provider value={contextValue}>
            {children}
        </KeepAliveRouterContext.Provider>
    );
};
