import type { Route } from './KeepAliveRouter';

/**
 * Route configuration helper
 * Makes it easier to define routes in a declarative way
 */
export interface RouteConfig {
    path: string;
    component?: React.ComponentType;
    title?: string;
    children?: RouteConfig[];
    index?: boolean;
    redirectTo?: string;
}

/**
 * Creates routes array from route configurations
 * This makes route definition more readable and maintainable
 */
export const createRoutes = (configs: RouteConfig[]): Route[] => {
    return configs.map(config => ({
        path: config.path,
        component: config.component,
        title: config.title,
        children: config.children ? createRoutes(config.children) : undefined,
        index: config.index,
        redirectTo: config.redirectTo,
    }));
};

/**
 * Helper to create a single route
 */
export const createRoute = (config: RouteConfig): Route => {
    return {
        path: config.path,
        component: config.component,
        title: config.title,
        children: config.children ? createRoutes(config.children) : undefined,
        index: config.index,
        redirectTo: config.redirectTo,
    };
};

/**
 * Route definition builder with fluent API
 */
export class RouteBuilder {
    private config: Partial<RouteConfig> = {};

    static create() {
        return new RouteBuilder();
    }

    path(path: string) {
        this.config.path = path;
        return this;
    }

    component(component: React.ComponentType) {
        this.config.component = component;
        return this;
    }

    title(title: string) {
        this.config.title = title;
        return this;
    }

    children(children: RouteConfig[]) {
        this.config.children = children;
        return this;
    }

    index(isIndex: boolean = true) {
        this.config.index = isIndex;
        return this;
    }

    redirectTo(path: string) {
        this.config.redirectTo = path;
        return this;
    }

    build(): Route {
        if (!this.config.path) {
            throw new Error('Route must have at least a path');
        }
        
        if (!this.config.component && !this.config.redirectTo) {
            throw new Error('Route must have either a component or redirectTo');
        }
        
        return {
            path: this.config.path,
            component: this.config.component,
            title: this.config.title,
            children: this.config.children ? createRoutes(this.config.children) : undefined,
            index: this.config.index,
            redirectTo: this.config.redirectTo,
        };
    }
}

// Convenience function for fluent API
export const route = () => RouteBuilder.create();
