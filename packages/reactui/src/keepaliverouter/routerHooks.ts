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
 * For now returns empty object, can be extended for path parameters
 */
export const useParams = () => {
    // TODO: Implement path parameter extraction if needed
    return {};
};

/**
 * Hook to get route metadata
 */
export const useRouteInfo = () => {
    const { currentRoute, routes } = useKeepAliveRouter();
    const route = routes.find(r => r.path === currentRoute);
    
    return {
        path: currentRoute,
        title: route?.title,
        component: route?.component,
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
