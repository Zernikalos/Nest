import React, { createContext, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createNavigatorStore } from '../core/navigatorStore';
import type { Route } from '../types';

interface KeepAliveRouterContextType {
    currentRoute: string;
    navigate: (path: string, addToHistory?: boolean) => void;
    routes: Route[];
    flatRoutes: Route[];
    setRoutes: (routes: Route[]) => void;
    isRouteActive: (path: string) => boolean;
    mountedRoutes: Set<string>;
    getRoutesForLevel: (level: number) => Route[];
    getRouteLevel: (path: string) => number;
    getCurrentRouteSegments: () => string[];
    goBack: () => void;
    goForward: () => void;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
    history: readonly string[];
    historyIndex: number;
}


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

// Simplified navigation hook
export const useNavigate = () => {
    const { navigate } = useKeepAliveRouter();
    return navigate;
};

// Simplified current route hook
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
    // Create store once and keep reference
    const storeRef = useRef<ReturnType<typeof createNavigatorStore> | null>(null);
    if (!storeRef.current) {
        storeRef.current = createNavigatorStore(initialRoute, initialRoutes);
    }

    // Use the Zustand store hook
    const useStore = storeRef.current;
    
    // Subscribe to store state for context
    const currentRoute = useStore((state) => state.currentRoute);
    const mountedRoutes = useStore((state) => state.mountedRoutes);
    const routes = useStore((state) => state.routes);
    const flatRoutes = useStore((state) => state.flatRoutes);
    const history = useStore((state) => state.history);
    const historyIndex = useStore((state) => state.historyIndex);

    // Update routes when they change
    useEffect(() => {
        useStore.getState().setRoutes(initialRoutes);
    }, [initialRoutes, useStore]);

    // Handle browser back/forward buttons (synchronization only)
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            useStore.getState().handlePopState(currentPath);
        };

        window.addEventListener('popstate', handlePopState);
        
        // Set initial URL
        useStore.getState().syncUrl();

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [useStore]);

    const contextValue: KeepAliveRouterContextType = {
        currentRoute,
        navigate: useStore.getState().navigate,
        routes,
        flatRoutes,
        setRoutes: useStore.getState().setRoutes,
        isRouteActive: useStore.getState().isRouteActive,
        mountedRoutes,
        getRoutesForLevel: useStore.getState().getRoutesForLevel,
        getRouteLevel: useStore.getState().getRouteLevel,
        getCurrentRouteSegments: useStore.getState().getCurrentRouteSegments,
        goBack: useStore.getState().goBack,
        goForward: useStore.getState().goForward,
        canGoBack: useStore.getState().canGoBack,
        canGoForward: useStore.getState().canGoForward,
        history,
        historyIndex,
    };

    return (
        <KeepAliveRouterContext.Provider value={contextValue}>
            {children}
        </KeepAliveRouterContext.Provider>
    );
};
