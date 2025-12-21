import { useKeepAliveRouter } from '@/keepaliverouter';

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
    
    return location;
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
    const { 
        currentRoute, 
        routes, 
        navigate, 
        goBack, 
        goForward, 
        canGoBack, 
        canGoForward,
        history,
        historyIndex
    } = useKeepAliveRouter();
    
    const route = routes.find(r => r.path === currentRoute);
    
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
        canGoForward,
        history,
        historyIndex,
        routeExists,
        getRouteInfo,
    };
    
    return routeInfo;
};

/**
 * Hook to check if a specific route is active
 */
export const useIsActive = (path: string) => {
    const { isRouteActive } = useKeepAliveRouter();
    const isActive = isRouteActive(path);
    return isActive;
};

/**
 * Hook to check if the current route is in the hierarchy of a given path
 * Returns true if the current route is the exact path or a subroute
 */
export const useIsInHierarchy = (path: string) => {
    const { isInRouteHierarchy } = useKeepAliveRouter();
    return isInRouteHierarchy(path);
};

/**
 * Hook to get all available routes
 */
export const useRoutes = () => {
    const { routes } = useKeepAliveRouter();
    return routes;
};

/**
 * Hook to get the last visited route within a given path hierarchy
 * @param path - The parent path to search within
 * @returns The last visited child route, or the parent path if none found
 */
export const useLastRouteInHierarchy = (path: string) => {
    const { getLastRouteInHierarchy } = useKeepAliveRouter();
    return getLastRouteInHierarchy(path);
};
