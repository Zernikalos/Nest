import { useRef, useState, useEffect, useCallback } from 'react';
import { normalizePath, splitPath } from '../utils/routeUtils';

/**
 * RouteHistory class manages navigation history in memory
 * Independent from React, making it testable and reusable
 */
export class RouteHistory {
    private history: string[] = [];
    private currentIndex: number = 0;
    private maxSize?: number;
    private onChange?: (route: string) => void;
    // Index that maps prefix -> last visited route with that prefix
    private prefixIndex: Map<string, string> = new Map();

    constructor(initialRoute: string, maxSize?: number) {
        const normalized = normalizePath(initialRoute);
        this.history = [normalized];
        this.currentIndex = 0;
        this.maxSize = maxSize;
        // Initialize index with initial route
        this.updatePrefixIndex(normalized);
    }

    /**
     * Updates the prefix index when a route is added
     */
    private updatePrefixIndex(route: string): void {
        const segments = splitPath(route);
        
        // For each prefix of the route (including the complete route)
        for (let i = 1; i <= segments.length; i++) {
            const prefix = '/' + segments.slice(0, i).join('/');
            // Update index: this route is the most recent for this prefix
            this.prefixIndex.set(prefix, route);
        }
    }

    /**
     * Rebuilds the prefix index when routes are removed from history
     */
    private rebuildPrefixIndex(): void {
        this.prefixIndex.clear();
        // Rebuild index from current history
        for (let i = 0; i <= this.currentIndex; i++) {
            const route = this.history[i];
            if (route) {
                this.updatePrefixIndex(route);
            }
        }
    }

    /**
     * Adds a route to the history
     * @param path - The route path to add
     * @param addToHistory - Whether to add to history (default: true)
     * @returns The normalized path that was added
     */
    add(path: string, addToHistory: boolean = true): string {
        const normalized = normalizePath(path);
        
        if (!addToHistory) {
            // Just update current without adding to history
            if (this.history[this.currentIndex] !== normalized) {
                this.history[this.currentIndex] = normalized;
                this.updatePrefixIndex(normalized);
                this.notifyChange(normalized);
            }
            return normalized;
        }

        // If we're in the middle of history, remove future entries
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
            // Rebuild index because we removed routes
            this.rebuildPrefixIndex();
        }

        // Add new route
        this.history.push(normalized);
        this.currentIndex = this.history.length - 1;
        this.updatePrefixIndex(normalized);

        // Enforce max size if set
        if (this.maxSize && this.history.length > this.maxSize) {
            const removeCount = this.history.length - this.maxSize;
            this.history = this.history.slice(removeCount);
            this.currentIndex = this.history.length - 1;
            // Rebuild index because we removed routes
            this.rebuildPrefixIndex();
        }

        this.notifyChange(normalized);
        return normalized;
    }

    /**
     * Navigates to the previous route in history
     * @returns The previous route or null if not possible
     */
    goBack(): string | null {
        if (!this.canGoBack()) {
            return null;
        }

        this.currentIndex--;
        const route = this.history[this.currentIndex];
        this.notifyChange(route);
        return route;
    }

    /**
     * Navigates to the next route in history
     * @returns The next route or null if not possible
     */
    goForward(): string | null {
        if (!this.canGoForward()) {
            return null;
        }

        this.currentIndex++;
        const route = this.history[this.currentIndex];
        this.notifyChange(route);
        return route;
    }

    /**
     * Checks if it's possible to navigate backward
     */
    canGoBack(): boolean {
        return this.currentIndex > 0;
    }

    /**
     * Checks if it's possible to navigate forward
     */
    canGoForward(): boolean {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * Gets the current route
     */
    getCurrent(): string {
        return this.history[this.currentIndex] || '/';
    }

    /**
     * Gets the entire history array (readonly)
     */
    getHistory(): readonly string[] {
        return [...this.history];
    }

    /**
     * Gets the current index
     */
    getIndex(): number {
        return this.currentIndex;
    }

    /**
     * Gets the last visited route within a given prefix
     * O(1) lookup using the prefix index
     * @param prefix - The prefix path to search within
     * @returns The last visited route with that prefix, or undefined if none found
     */
    getLastRouteInPrefix(prefix: string): string | undefined {
        const normalized = normalizePath(prefix);
        return this.prefixIndex.get(normalized);
    }

    /**
     * Sets the onChange callback
     */
    setOnChange(callback: (route: string) => void): void {
        this.onChange = callback;
    }

    /**
     * Synchronizes the browser URL without creating history entries
     */
    syncUrl(path: string): void {
        const normalized = normalizePath(path);
        if (window.location.pathname !== normalized) {
            window.history.replaceState(null, '', normalized);
        }
    }

    /**
     * Notifies listeners of route changes
     */
    private notifyChange(route: string): void {
        if (this.onChange) {
            this.onChange(route);
        }
    }
}

/**
 * Hook that connects RouteHistory with React state
 */
export const useRouteHistory = (initialRoute: string, maxSize?: number) => {
    const historyRef = useRef<RouteHistory | null>(null);
    
    // Initialize RouteHistory instance
    if (!historyRef.current) {
        historyRef.current = new RouteHistory(initialRoute, maxSize);
    }

    const [currentRoute, setCurrentRoute] = useState(initialRoute);

    // Set up onChange callback to update React state
    useEffect(() => {
        const history = historyRef.current!;
        const callback = (route: string) => {
            setCurrentRoute((prev) => {
                // Only update if different to avoid unnecessary re-renders
                if (prev !== route) {
                    return route;
                }
                return prev;
            });
        };
        history.setOnChange(callback);
        
        // Cleanup: remove callback on unmount
        return () => {
            history.setOnChange(() => {});
        };
    }, []);
    
    // Sync currentRoute with history on mount (in case history was updated before callback was set)
    useEffect(() => {
        const history = historyRef.current!;
        const current = history.getCurrent();
        if (current !== currentRoute) {
            setCurrentRoute(current);
        }
    }, [currentRoute]);

    // Memoized functions
    const add = useCallback((path: string, addToHistory: boolean = true) => {
        return historyRef.current!.add(path, addToHistory);
    }, []);

    const goBack = useCallback(() => {
        return historyRef.current!.goBack();
    }, []);

    const goForward = useCallback(() => {
        return historyRef.current!.goForward();
    }, []);

    const canGoBack = useCallback(() => {
        return historyRef.current!.canGoBack();
    }, []);

    const canGoForward = useCallback(() => {
        return historyRef.current!.canGoForward();
    }, []);

    const getCurrent = useCallback(() => {
        return historyRef.current!.getCurrent();
    }, []);

    const getHistory = useCallback(() => {
        return historyRef.current!.getHistory();
    }, []);

    const getIndex = useCallback(() => {
        return historyRef.current!.getIndex();
    }, []);

    const syncUrl = useCallback((path: string) => {
        historyRef.current!.syncUrl(path);
    }, []);

    return {
        currentRoute,
        add,
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        getCurrent,
        getHistory,
        getIndex,
        syncUrl,
    };
};

