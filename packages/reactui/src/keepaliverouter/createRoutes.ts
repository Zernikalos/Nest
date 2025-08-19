import type { Route } from './KeepAliveRouter';

/**
 * Route configuration helper
 * Makes it easier to define routes in a declarative way
 */
export interface RouteConfig {
    path: string;
    component: React.ComponentType;
    title?: string;
    icon?: React.ComponentType;
    description?: string;
    children?: RouteConfig[];
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

    icon(icon: React.ComponentType) {
        this.config.icon = icon;
        return this;
    }

    description(description: string) {
        this.config.description = description;
        return this;
    }

    children(children: RouteConfig[]) {
        this.config.children = children;
        return this;
    }

    build(): Route {
        if (!this.config.path || !this.config.component) {
            throw new Error('Route must have at least a path and component');
        }
        
        return {
            path: this.config.path,
            component: this.config.component,
            title: this.config.title,
            children: this.config.children ? createRoutes(this.config.children) : undefined,
        };
    }
}

// Convenience function for fluent API
export const route = () => RouteBuilder.create();
