import { normalizePath, isExactMatch, getParentPaths, splitPath, flattenRoutes } from '../utils/routeUtils';
import { RouteHistory } from './routeHistory';
import { routerLogger, logRouteChange, logRouterState } from '../utils/logger';
import type { Route } from '../types';

/**
 * Navigator state interface
 */
export interface NavigatorState {
    currentRoute: string;
    mountedRoutes: Set<string>;
    routes: Route[];
    flatRoutes: Route[];
    history: readonly string[];
    historyIndex: number;
}

/**
 * Navigator class manages all router logic independently from React
 * This makes the router testable, reusable, and easier to maintain
 */
export class Navigator {
    private routes: Route[] = [];
    private flatRoutes: Route[] = [];
    private currentRoute: string;
    private mountedRoutes: Set<string>;
    private history: RouteHistory;
    private onStateChange?: (state: NavigatorState) => void;

    constructor(initialRoute: string, routes: Route[], maxHistorySize?: number) {
        const normalized = normalizePath(initialRoute);
        this.currentRoute = normalized;
        this.mountedRoutes = new Set([normalized]);
        this.history = new RouteHistory(normalized, maxHistorySize);
        
        // Listen to history changes
        this.history.setOnChange((route) => {
            this.currentRoute = route;
            this.ensureRoutesMounted(route);
            this.notifyStateChange();
        });
        
        // Set initial routes
        this.setRoutes(routes);
    }

    /**
     * Navigates to a new route
     */
    navigate(path: string, addToHistory: boolean = true): void {
        const normalized = normalizePath(path);
        
        // Early return if navigating to the same route
        if (isExactMatch(normalized, this.currentRoute)) {
            return;
        }

        const previousRoute = this.currentRoute;
        logRouteChange(previousRoute, normalized, 'navigate');
        
        // Mount routes first
        this.ensureRoutesMounted(normalized);
        
        // Update history (this will trigger onChange callback)
        this.history.add(normalized, addToHistory);
        this.history.syncUrl(normalized);
        
        routerLogger.info('Navigation completed', { from: previousRoute, to: normalized });
    }

    /**
     * Navigates to the previous route in history
     */
    goBack(): void {
        const previousRoute = this.history.goBack();
        if (previousRoute) {
            this.ensureRoutesMounted(previousRoute);
            this.history.syncUrl(previousRoute);
            logRouteChange(this.currentRoute, previousRoute, 'goBack');
        }
    }

    /**
     * Navigates to the next route in history
     */
    goForward(): void {
        const nextRoute = this.history.goForward();
        if (nextRoute) {
            this.ensureRoutesMounted(nextRoute);
            this.history.syncUrl(nextRoute);
            logRouteChange(this.currentRoute, nextRoute, 'goForward');
        }
    }

    /**
     * Checks if it's possible to navigate backward
     */
    canGoBack(): boolean {
        return this.history.canGoBack();
    }

    /**
     * Checks if it's possible to navigate forward
     */
    canGoForward(): boolean {
        return this.history.canGoForward();
    }

    /**
     * Sets the routes configuration
     */
    setRoutes(routes: Route[]): void {
        this.routes = routes;
        this.flatRoutes = flattenRoutes(routes);
        this.notifyStateChange();
    }

    /**
     * Gets the current route
     */
    getCurrentRoute(): string {
        return this.currentRoute;
    }

    /**
     * Gets mounted routes (returns a copy)
     */
    getMountedRoutes(): Set<string> {
        return new Set(this.mountedRoutes);
    }

    /**
     * Gets all routes
     */
    getRoutes(): Route[] {
        return this.routes;
    }

    /**
     * Gets flattened routes
     */
    getFlatRoutes(): Route[] {
        return this.flatRoutes;
    }

    /**
     * Gets routes for a specific level
     */
    getRoutesForLevel(level: number): Route[] {
        return this.flatRoutes.filter(route => route.level === level);
    }

    /**
     * Gets the level of a specific route
     */
    getRouteLevel(path: string): number {
        const route = this.flatRoutes.find(r => r.path === path);
        return route?.level ?? 0;
    }

    /**
     * Gets current route segments
     */
    getCurrentRouteSegments(): string[] {
        return splitPath(this.currentRoute);
    }

    /**
     * Checks if a route is active
     */
    isRouteActive(path: string): boolean {
        return this.currentRoute === path;
    }

    /**
     * Gets the current navigator state
     */
    getState(): NavigatorState {
        return {
            currentRoute: this.currentRoute,
            mountedRoutes: new Set(this.mountedRoutes),
            routes: this.routes,
            flatRoutes: this.flatRoutes,
            history: this.history.getHistory(),
            historyIndex: this.history.getIndex(),
        };
    }

    /**
     * Sets the state change callback
     */
    setOnStateChange(callback: (state: NavigatorState) => void): void {
        this.onStateChange = callback;
        // Immediately notify with current state to ensure synchronization
        callback(this.getState());
    }

    /**
     * Removes the state change callback
     */
    removeOnStateChange(): void {
        this.onStateChange = undefined;
    }

    /**
     * Ensures all parent routes are mounted for a given path
     */
    private ensureRoutesMounted(path: string): void {
        const parentPaths = getParentPaths(path);
        let hasChanges = false;

        for (const parentPath of parentPaths) {
            if (!this.mountedRoutes.has(parentPath)) {
                this.mountedRoutes.add(parentPath);
                hasChanges = true;
                logRouterState({ 
                    newlyMounted: parentPath, 
                    totalMounted: this.mountedRoutes.size 
                }, 'route mounted');
            }
        }

        if (hasChanges) {
            this.notifyStateChange();
        }
    }

    /**
     * Notifies listeners of state changes
     */
    private notifyStateChange(): void {
        if (this.onStateChange) {
            this.onStateChange(this.getState());
        }
    }

    /**
     * Handles browser popstate event (for synchronization)
     */
    handlePopState(path: string): void {
        const normalized = normalizePath(path);
        if (normalized !== this.currentRoute) {
            logRouteChange(this.currentRoute, normalized, 'browser navigation');
            this.ensureRoutesMounted(normalized);
            // Update history without adding to history (user used browser buttons)
            this.history.add(normalized, false);
            this.history.syncUrl(normalized);
        }
    }

    /**
     * Syncs the browser URL with current route
     */
    syncUrl(): void {
        this.history.syncUrl(this.currentRoute);
    }
}


