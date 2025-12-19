import React, { useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';
import { routerLogger, logRouteMounting } from './logger';
import { resolvePath, getPathUpToLevel, findMatchingRoute } from './routeUtils';

// Context for outlet nesting level
interface OutletLevelContextType {
    level: number;
}

const OutletLevelContext = createContext<OutletLevelContextType>({ level: 0 });

// Hook to get current outlet level
export const useOutletLevel = () => {
    return useContext(OutletLevelContext);
};

interface KeepAliveOutletProps {
    className?: string;
}

// Redirect path resolution using routeUtils
const resolveRedirectPath = (currentPath: string, redirectTo: string): string => {
    return resolvePath(currentPath, redirectTo);
};

export const KeepAliveOutlet: React.FC<KeepAliveOutletProps> = ({ className = '' }) => {
    const { 
        getRoutesForLevel, 
        mountedRoutes, 
        navigate, 
        currentRoute
    } = useKeepAliveRouter();
    
    const { level: currentLevel } = useOutletLevel();
    const nextLevel = currentLevel + 1;
    
    // Get routes that belong to this outlet level
    const routesForThisLevel = getRoutesForLevel(currentLevel);
    
    // Memoized active route detection to avoid recalculation on every render
    const activeRoute = useMemo(() => {
        const pathUpToLevel = getPathUpToLevel(currentRoute, currentLevel);
        return findMatchingRoute(routesForThisLevel, pathUpToLevel);
    }, [currentRoute, currentLevel, routesForThisLevel]);

    // Handle redirects - use ref to prevent multiple redirects and loops
    const redirectHandledRef = useRef<string | null>(null);
    const lastRedirectRouteRef = useRef<string | null>(null);
    
    useEffect(() => {
        // Reset redirect tracking if the route changed (not from a redirect)
        if (lastRedirectRouteRef.current && lastRedirectRouteRef.current !== currentRoute) {
            redirectHandledRef.current = null;
            lastRedirectRouteRef.current = null;
        }
        
        if (activeRoute?.redirectTo) {
            const resolvedPath = resolveRedirectPath(currentRoute, activeRoute.redirectTo);
            const redirectKey = `${activeRoute.path}:${resolvedPath}`;
            
            // Only redirect if we haven't handled this redirect for this route combination
            // and we're not already at the destination
            if (redirectHandledRef.current !== redirectKey && resolvedPath !== currentRoute) {
                redirectHandledRef.current = redirectKey;
                lastRedirectRouteRef.current = currentRoute;
                routerLogger.info('Handling redirect at level', { 
                    level: currentLevel,
                    from: currentRoute, 
                    to: resolvedPath, 
                    redirectTo: activeRoute.redirectTo 
                });
                navigate(resolvedPath);
            }
        } else {
            // Reset redirect tracking when no redirect is needed
            redirectHandledRef.current = null;
            lastRedirectRouteRef.current = null;
        }
    }, [activeRoute, currentRoute, currentLevel, navigate]);


    return (
        <OutletLevelContext.Provider value={{ level: nextLevel }}>
            <div className={className}>
                {routesForThisLevel.map((route) => {
                    const { path, component: Component, redirectTo } = route;
                    const isActive = activeRoute?.path === path;
                    const isMounted = mountedRoutes.has(path);
                    
                    // Skip redirect routes and routes without components
                    if (redirectTo || !Component) {
                        return null;
                    }
                    
                    // Only render if the route has been visited at least once
                    if (!isMounted) {
                        return null;
                    }
                    
                    // Log route rendering state
                    logRouteMounting(path, isActive ? 'render' : 'hide');

                    return (
                        <div
                            key={path}
                            style={{
                                display: isActive ? 'block' : 'none',
                                position: isActive ? 'relative' : 'absolute',
                            }}
                        >
                            <Component />
                        </div>
                    );
                })}
            </div>
        </OutletLevelContext.Provider>
    );
};
