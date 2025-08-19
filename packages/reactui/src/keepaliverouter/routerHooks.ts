import { useKeepAliveRouter } from './KeepAliveRouter';
import { hooksLogger, logHookUsage } from './logger';

/**
 * Hook similar to react-router-dom's useLocation
 * Returns location-like object with pathname
 */
export const useLocation = () => {
    const { currentRoute } = useKeepAliveRouter();
    
    const location = {
        pathname: currentRoute,
        search: '',
        hash: '',
        state: null,
        key: currentRoute,
    };
    
    logHookUsage('useLocation', location);
    return location;
};

/**
 * Hook similar to react-router-dom's useParams
 * Returns empty object (path parameters not implemented)
 */
export const useParams = () => {
    logHookUsage('useParams', 'No params implemented');
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
    const goBack = () => {
        hooksLogger('goBack called');
        window.history.back();
    };
    const goForward = () => {
        hooksLogger('goForward called');
        window.history.forward();
    };
    const canGoBack = () => window.history.length > 1;
    const routeExists = (path: string) => routes.some(r => r.path === path);
    const getRouteInfo = (path: string) => {
        return routes.find(r => r.path === path);
    };
    
    const routeInfo = {
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
    
    logHookUsage('useRouteInfo', { currentRoute, hasRoute: !!route });
    return routeInfo;
};

/**
 * Hook to check if a specific route is active
 */
export const useIsActive = (path: string) => {
    const { isRouteActive } = useKeepAliveRouter();
    const isActive = isRouteActive(path);
    logHookUsage('useIsActive', { path, isActive });
    return isActive;
};

/**
 * Hook to get all available routes
 */
export const useRoutes = () => {
    const { routes } = useKeepAliveRouter();
    logHookUsage('useRoutes', { routeCount: routes.length });
    return routes;
};
