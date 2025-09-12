import React, { useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';
import { routerLogger, logRouteMounting } from './logger';

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

// Simplified redirect path resolution
const resolveRedirectPath = (currentPath: string, redirectTo: string): string => {
    if (redirectTo.startsWith('/')) {
        return redirectTo;
    }
    const pathParts = currentPath.split('/');
    pathParts.pop();
    return `${pathParts.join('/')}/${redirectTo}`;
};

export const KeepAliveOutlet: React.FC<KeepAliveOutletProps> = ({ className = '' }) => {
    const { 
        getRoutesForLevel, 
        mountedRoutes, 
        navigate, 
        currentRoute,
        getCurrentRouteSegments 
    } = useKeepAliveRouter();
    
    const { level: currentLevel } = useOutletLevel();
    const nextLevel = currentLevel + 1;
    
    // Get routes that belong to this outlet level
    const routesForThisLevel = getRoutesForLevel(currentLevel);
    
    // Get current route segments to determine what should be active at this level
    const currentSegments = getCurrentRouteSegments();
    
    // Memoized active route detection to avoid recalculation on every render
    const activeRoute = useMemo(() => {
        const pathUpToLevel = '/' + currentSegments.slice(0, currentLevel + 1).join('/');
        return routesForThisLevel.find(route => route.path === pathUpToLevel);
    }, [currentSegments, currentLevel, routesForThisLevel]);

    // Memoized redirect handler to avoid recreating function on every render
    const handleRedirect = useCallback(() => {
        if (activeRoute?.redirectTo) {
            const resolvedPath = resolveRedirectPath(currentRoute, activeRoute.redirectTo);
            routerLogger.info('Handling redirect at level', { 
                level: currentLevel,
                from: currentRoute, 
                to: resolvedPath, 
                redirectTo: activeRoute.redirectTo 
            });
            navigate(resolvedPath);
        }
    }, [activeRoute, currentRoute, currentLevel, navigate]);

    // Handle redirects
    useEffect(() => {
        handleRedirect();
    }, [handleRedirect]);

    // Log outlet rendering
    routerLogger.debug('Outlet rendering at level', {
        level: currentLevel,
        routesCount: routesForThisLevel.length,
        activeRoute: activeRoute?.path,
        currentRoute,
        currentSegments
    });

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
