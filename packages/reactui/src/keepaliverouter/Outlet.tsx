import React from 'react';
import { useKeepAliveRouter } from './KeepAliveRouter';

interface OutletProps {
    className?: string;
}

/**
 * Outlet component - renders the current route's component
 * Similar to react-router-dom's Outlet but works with our keep-alive system
 */
export const Outlet: React.FC<OutletProps> = ({ className = '' }) => {
    const { flatRoutes, currentRoute } = useKeepAliveRouter();

    // Find the current route
    const route = flatRoutes.find(r => r.path === currentRoute);
    
    if (!route) {
        return (
            <div className={`${className} p-6`}>
                <h2 className="text-xl font-semibold text-red-600">Route not found</h2>
                <p className="text-gray-600">The route "{currentRoute}" was not found.</p>
            </div>
        );
    }

    const Component = route.component;
    
    return (
        <div className={className}>
            <Component />
        </div>
    );
};
