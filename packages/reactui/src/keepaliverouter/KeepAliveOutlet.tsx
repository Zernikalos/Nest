import React, { useEffect, createContext, useContext } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';
import { outletLogger, logRouteMounting } from './logger';

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

// Helper function to resolve redirect paths
const resolveRedirectPath = (currentPath: string, redirectTo: string): string => {
    if (redirectTo.startsWith('/')) {
        // Absolute path
        return redirectTo;
    } else {
        // Relative path - combine with current path's parent
        const pathParts = currentPath.split('/');
        pathParts.pop(); // Remove the last part
        return `${pathParts.join('/')}/${redirectTo}`;
    }
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
    
    // Find the route that should be active at this level
    const getActiveRouteForLevel = () => {
        // Build the path up to the current level
        const pathUpToLevel = '/' + currentSegments.slice(0, currentLevel + 1).join('/');
        
        // Find exact match or closest parent route at this level
        return routesForThisLevel.find(route => {
            // Check if this route matches the current path at this level
            const routeSegments = route.path.split('/').filter(s => s !== '');
            const currentLevelPath = '/' + routeSegments.slice(0, currentLevel + 1).join('/');
            
            return currentLevelPath === pathUpToLevel || route.path === currentRoute;
        });
    };
    
    const activeRoute = getActiveRouteForLevel();

    // Handle redirects
    useEffect(() => {
        if (activeRoute?.redirectTo) {
            const resolvedPath = resolveRedirectPath(currentRoute, activeRoute.redirectTo);
            outletLogger('Handling redirect at level:', { 
                level: currentLevel,
                from: currentRoute, 
                to: resolvedPath, 
                redirectTo: activeRoute.redirectTo 
            });
            navigate(resolvedPath);
        }
    }, [currentRoute, activeRoute, navigate, currentLevel]);

    outletLogger('Outlet rendering at level:', {
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
                    
                    // Skip redirect routes - they don't render content
                    if (redirectTo) {
                        return null;
                    }
                    
                    // Skip routes without components
                    if (!Component) {
                        return null;
                    }
                    
                    // Only render if the route has been visited at least once
                    if (!isMounted) {
                        return null;
                    }
                    
                    // Log route rendering state (only for state changes, not every render)
                    if (isActive) {
                        logRouteMounting(path, 'render');
                    } else {
                        logRouteMounting(path, 'hide');
                    }

                    return (
                        <div
                            key={path}
                            style={{
                                display: isActive ? 'block' : 'none',
                                height: isActive ? 'auto' : '0',
                                overflow: isActive ? 'visible' : 'hidden',
                            }}
                            className="h-full"
                        >
                            <Component />
                        </div>
                    );
                })}
            </div>
        </OutletLevelContext.Provider>
    );
};
