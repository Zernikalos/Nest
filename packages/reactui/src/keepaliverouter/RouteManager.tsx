import React from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';

interface RouteManagerProps {
    className?: string;
}

export const RouteManager: React.FC<RouteManagerProps> = ({ className = '' }) => {
    const { flatRoutes, isRouteActive, mountedRoutes } = useKeepAliveRouter();

    return (
        <div className={className}>
            {flatRoutes.map(({ path, component: Component }) => {
                const isActive = isRouteActive(path);
                const isMounted = mountedRoutes.has(path);
                
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
