import React, { useEffect } from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';

interface KeepAliveOutletProps {
    className?: string;
}

export const KeepAliveOutlet: React.FC<KeepAliveOutletProps> = ({ className = '' }) => {
    const { flatRoutes, isRouteActive, mountedRoutes, navigate, currentRoute } = useKeepAliveRouter();

    // Handle redirects
    useEffect(() => {
        const currentRouteObj = flatRoutes.find(route => route.path === currentRoute);
        if (currentRouteObj?.redirectTo) {
            navigate(currentRouteObj.redirectTo);
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
