import type { ComponentType } from 'react';

/**
 * Route interface for the keep-alive router
 */
export interface Route {
    path: string;
    component?: ComponentType;
    title?: string;
    children?: Route[];
    index?: boolean;
    redirectTo?: string;
    level?: number; // level of the route in the hierarchy
    originalPath?: string; // original path of the route
}

