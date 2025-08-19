import React, { useEffect } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';
import { outletLogger, logRouteMounting, logRouteChange } from './logger';

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
    const { flatRoutes, isRouteActive, mountedRoutes, navigate, currentRoute } = useKeepAliveRouter();

    // Handle redirects
    useEffect(() => {
        const currentRouteObj = flatRoutes.find(route => route.path === currentRoute);
        if (currentRouteObj?.redirectTo) {
            const resolvedPath = resolveRedirectPath(currentRoute, currentRouteObj.redirectTo);
            outletLogger('Handling redirect:', { 
                from: currentRoute, 
                to: resolvedPath, 
                redirectTo: currentRouteObj.redirectTo 
            });
            navigate(resolvedPath);
        }
    }, [currentRoute, flatRoutes, navigate]);

    return (
        <div className={className}>
            {flatRoutes.map((route) => {
                const { path, component: Component, redirectTo } = route;
                const isActive = isRouteActive(path);
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
    );
};
