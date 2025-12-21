import { create } from 'zustand';
import { Navigator } from './navigator';
import type { NavigatorState } from './navigator';
import type { Route } from '../types';

/**
 * Navigator store interface
 * Extends NavigatorState with actions and the Navigator instance
 */
interface NavigatorStore extends NavigatorState {
    // Actions
    navigate: (path: string, addToHistory?: boolean) => void;
    goBack: () => void;
    goForward: () => void;
    setRoutes: (routes: Route[]) => void;
    handlePopState: (path: string) => void;
    syncUrl: () => void;
    
    // Getters
    getRoutesForLevel: (level: number) => Route[];
    getRouteLevel: (path: string) => number;
    getCurrentRouteSegments: () => string[];
    isRouteActive: (path: string) => boolean;
    isInRouteHierarchy: (path: string) => boolean;
    getLastRouteInHierarchy: (path: string) => string;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
    
    // Internal Navigator instance (for advanced usage)
    _navigator: Navigator;
}

/**
 * Creates a Zustand store for the Navigator
 */
export const createNavigatorStore = (initialRoute: string, routes: Route[], maxHistorySize?: number) => {
    const navigator = new Navigator(initialRoute, routes, maxHistorySize);
    
    // Get initial state
    const initialState = navigator.getState();
    
    return create<NavigatorStore>((set) => {
        // Set up callback to update store when Navigator state changes
        navigator.setOnStateChange((state) => {
            set(state);
        });
        
        return {
            ...initialState,
            _navigator: navigator,
            
            // Actions
            navigate: (path: string, addToHistory?: boolean) => {
                navigator.navigate(path, addToHistory ?? true);
            },
            
            goBack: () => {
                navigator.goBack();
            },
            
            goForward: () => {
                navigator.goForward();
            },
            
            setRoutes: (newRoutes: Route[]) => {
                navigator.setRoutes(newRoutes);
            },
            
            handlePopState: (path: string) => {
                navigator.handlePopState(path);
            },
            
            syncUrl: () => {
                navigator.syncUrl();
            },
            
            // Getters
            getRoutesForLevel: (level: number) => {
                return navigator.getRoutesForLevel(level);
            },
            
            getRouteLevel: (path: string) => {
                return navigator.getRouteLevel(path);
            },
            
            getCurrentRouteSegments: () => {
                return navigator.getCurrentRouteSegments();
            },
            
            isRouteActive: (path: string) => {
                return navigator.isRouteActive(path);
            },
            
            isInRouteHierarchy: (path: string) => {
                return navigator.isInRouteHierarchy(path);
            },
            
            getLastRouteInHierarchy: (path: string) => {
                return navigator.getLastRouteInHierarchy(path);
            },
            
            canGoBack: () => {
                return navigator.canGoBack();
            },
            
            canGoForward: () => {
                return navigator.canGoForward();
            },
        };
    });
};

