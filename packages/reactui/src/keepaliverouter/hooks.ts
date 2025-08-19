import { useKeepAliveRouter } from './KeepAliveRouter';

// Hook personalizado para navegación con utilidades adicionales
export const useCustomNavigate = () => {
    const { navigate, currentRoute, routes } = useKeepAliveRouter();

    const navigateWithHistory = (path: string, replace = false) => {
        if (replace) {
            window.history.replaceState(null, '', path);
        }
        navigate(path);
    };

    const goBack = () => {
        window.history.back();
    };

    const goForward = () => {
        window.history.forward();
    };

    const canGoBack = () => {
        return window.history.length > 1;
    };

    // Get route info by path
    const getRouteInfo = (path: string) => {
        return routes.find(route => route.path === path);
    };

    // Check if route exists
    const routeExists = (path: string) => {
        return routes.some(route => route.path === path);
    };

    return {
        navigate,
        navigateWithHistory,
        goBack,
        goForward,
        canGoBack,
        currentRoute,
        getRouteInfo,
        routeExists,
    };
};

// Hook para obtener información de la ruta actual
export const useCurrentRouteInfo = () => {
    const { currentRoute, routes } = useKeepAliveRouter();
    
    const currentRouteInfo = routes.find(route => route.path === currentRoute);
    
    return {
        path: currentRoute,
        title: currentRouteInfo?.title,
        component: currentRouteInfo?.component,
    };
};
