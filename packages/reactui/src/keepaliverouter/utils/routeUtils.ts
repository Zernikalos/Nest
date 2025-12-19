/**
 * Route utility functions for path operations
 */

/**
 * Normalizes a path by removing trailing slashes and ensuring it starts with /
 */
export const normalizePath = (path: string): string => {
    if (!path) return '/';
    const normalized = path.trim().replace(/\/+$/, '');
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
};

/**
 * Joins path segments, handling leading/trailing slashes
 */
export const joinPaths = (...segments: string[]): string => {
    return segments
        .filter(Boolean)
        .map(segment => segment.replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/');
};

/**
 * Splits a path into segments, filtering empty segments
 */
export const splitPath = (path: string): string[] => {
    return path.split('/').filter(segment => segment !== '');
};

/**
 * Gets the path up to a specific level
 */
export const getPathUpToLevel = (path: string, level: number): string => {
    const segments = splitPath(path);
    const pathSegments = segments.slice(0, level + 1);
    return '/' + pathSegments.join('/');
};

/**
 * Checks if a path matches another path (exact match)
 */
export const isExactMatch = (path1: string, path2: string): boolean => {
    return normalizePath(path1) === normalizePath(path2);
};

/**
 * Checks if a path starts with another path (prefix match)
 */
export const isPathPrefix = (path: string, prefix: string): boolean => {
    const normalizedPath = normalizePath(path);
    const normalizedPrefix = normalizePath(prefix);
    return normalizedPath === normalizedPrefix || normalizedPath.startsWith(normalizedPrefix + '/');
};

/**
 * Gets the parent path of a given path
 */
export const getParentPath = (path: string): string => {
    const segments = splitPath(path);
    if (segments.length <= 1) return '/';
    segments.pop();
    return '/' + segments.join('/');
};

/**
 * Gets the depth/level of a path
 */
export const getPathDepth = (path: string): number => {
    return splitPath(path).length;
};

/**
 * Resolves a relative path against a base path
 */
export const resolvePath = (basePath: string, relativePath: string): string => {
    if (relativePath.startsWith('/')) {
        return normalizePath(relativePath);
    }
    
    const baseSegments = splitPath(basePath);
    const relativeSegments = splitPath(relativePath);
    
    // Handle .. segments
    const resolved: string[] = [];
    for (const segment of relativeSegments) {
        if (segment === '..') {
            resolved.pop();
        } else if (segment !== '.') {
            resolved.push(segment);
        }
    }
    
    return '/' + [...baseSegments, ...resolved].join('/');
};

/**
 * Extracts query parameters from a URL
 */
export const getQueryParams = (url: string): Record<string, string> => {
    const params: Record<string, string> = {};
    try {
        const urlObj = new URL(url, window.location.origin);
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
    } catch {
        // If URL parsing fails, return empty object
    }
    return params;
};

/**
 * Builds a URL with query parameters
 */
export const buildUrl = (path: string, params?: Record<string, string | number | boolean>): string => {
    try {
        const url = new URL(path, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.set(key, String(value));
            });
        }
        return url.pathname + url.search;
    } catch {
        return path;
    }
};

/**
 * Gets all parent paths for a given path (including the path itself)
 * Useful for mounting parent routes when navigating to nested routes
 */
export const getParentPaths = (path: string): string[] => {
    const segments = splitPath(path);
    const paths: string[] = [];
    
    for (let i = 1; i <= segments.length; i++) {
        paths.push('/' + segments.slice(0, i).join('/'));
    }
    
    return paths;
};

/**
 * Finds a matching route from a list of routes
 * Tries exact match first, then falls back to segment-based matching
 */
export const findMatchingRoute = <T extends { path: string }>(
    routes: T[],
    targetPath: string
): T | undefined => {
    // Try exact match first
    let found = routes.find(route => route.path === targetPath);
    
    // If no exact match, try segment-based matching
    if (!found) {
        const targetSegments = splitPath(targetPath);
        found = routes.find(route => {
            const routeSegments = splitPath(route.path);
            return routeSegments.length === targetSegments.length && 
                   routeSegments.every((seg, i) => seg === targetSegments[i]);
        });
    }
    
    return found;
};

/**
 * Flattens nested routes into a flat array with levels
 * This is a utility function that should be imported from routeUtils
 */
export const flattenRoutes = <T extends { 
    path: string; 
    children?: T[];
    [key: string]: any;
}>(
    routes: T[], 
    parentPath = '', 
    level = 0
): T[] => {
    const flattened: T[] = [];
    
    for (const route of routes) {
        // Handle empty path (index routes) - use parentPath directly
        let fullPath: string;
        if (!route.path || route.path === '') {
            // Index route: use parent path as-is
            fullPath = parentPath || '/';
        } else if (parentPath) {
            // Child route: join with parent and normalize to ensure leading slash
            fullPath = normalizePath(joinPaths(parentPath, route.path));
        } else {
            // Root route: normalize
            fullPath = normalizePath(route.path);
        }
        
        // Create flattened route with full path and level
        const flattenedRoute: T = {
            ...route,
            path: fullPath,
            level,
            originalPath: route.path,
        };
        
        flattened.push(flattenedRoute);
        
        if (route.children) {
            flattened.push(...flattenRoutes(route.children, fullPath, level + 1));
        }
    }
    
    return flattened;
};

