import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

// Types for our custom router
export interface Route {
    path: string;
    component?: React.ComponentType;
    title?: string;
    children?: Route[];
    index?: boolean;
    redirectTo?: string;
}

interface KeepAliveRouterContextType {
    currentRoute: string;
    navigate: (path: string) => void;
    routes: Route[];
    flatRoutes: Route[];
    setRoutes: (routes: Route[]) => void;
    isRouteActive: (path: string) => boolean;
    mountedRoutes: Set<string>;
}

// Helper function to flatten nested routes
const flattenRoutes = (routes: Route[], parentPath = ''): Route[] => {
    const flattened: Route[] = [];
    
    for (const route of routes) {
        // Handle path concatenation properly
        const fullPath = parentPath 
            ? (route.path.startsWith('/') 
                ? `${parentPath}${route.path}` 
                : `${parentPath}/${route.path}`)
            : route.path;
        
        // Add the current route (without children to avoid circular references)
        flattened.push({
            ...route,
            path: fullPath,
            children: undefined, // Remove children from flattened route
        });
        
        // Recursively add children
        if (route.children) {
            flattened.push(...flattenRoutes(route.children, fullPath));
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

// Hook for navigation (similar to useNavigate from react-router)
export const useNavigate = () => {
    const { navigate } = useKeepAliveRouter();
    return navigate;
};

// Hook to get current route
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
    
    // Temporary: Use routes directly without flattening to fix the issue
    const flatRoutes = useMemo(() => {
        console.log('Using routes directly:', routes);
        return routes;
    }, [routes]);

    const navigate = (path: string) => {
        console.log('Navigating to:', path);
        // Add the route to mounted routes if it's not already there
        setMountedRoutes(prev => new Set([...prev, path]));
        setCurrentRoute(path);
    };

    const isRouteActive = (path: string) => {
        return currentRoute === path;
    };

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
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
    };

    return (
        <KeepAliveRouterContext.Provider value={contextValue}>
            {children}
        </KeepAliveRouterContext.Provider>
    );
};
