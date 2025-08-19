import { useKeepAliveRouter } from './KeepAliveRouter';

/**
 * Hook similar to react-router-dom's useLocation
 * Returns location-like object with pathname
 */
export const useLocation = () => {
    const { currentRoute } = useKeepAliveRouter();
    
    return {
        pathname: currentRoute,
        search: '',
        hash: '',
        state: null,
        key: currentRoute,
    };
};

/**
 * Hook similar to react-router-dom's useParams
 * Returns empty object (path parameters not implemented)
 */
export const useParams = () => {
    return {};
};

/**
 * Hook to get route metadata
 * Enhanced version with additional utilities
 */
export const useRouteInfo = () => {
    const { currentRoute, routes, navigate } = useKeepAliveRouter();
    const route = routes.find(r => r.path === currentRoute);
    
    // Additional navigation utilities
    const goBack = () => window.history.back();
    const goForward = () => window.history.forward();
    const canGoBack = () => window.history.length > 1;
    const routeExists = (path: string) => routes.some(r => r.path === path);
    const getRouteInfo = (path: string) => {
        return routes.find(r => r.path === path);
    };
    
    return {
        path: currentRoute,
        title: route?.title,
        component: route?.component,
        // Navigation utilities
        navigate,
        goBack,
        goForward,
        canGoBack,
        routeExists,
        getRouteInfo,
    };
};

/**
 * Hook to check if a specific route is active
 */
export const useIsActive = (path: string) => {
    const { isRouteActive } = useKeepAliveRouter();
    return isRouteActive(path);
};

/**
 * Hook to get all available routes
 */
export const useRoutes = () => {
    const { routes } = useKeepAliveRouter();
    return routes;
};
