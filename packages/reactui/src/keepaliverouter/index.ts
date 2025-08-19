// Core router exports
export { KeepAliveRouterProvider, useKeepAliveRouter, useNavigate, useCurrentRoute } from './KeepAliveRouter';
export { KeepAliveOutlet } from './KeepAliveOutlet';
export type { Route } from './KeepAliveRouter';

// Router components
export { Link, NavLink } from './Link';
export { Navigate } from './Navigate';

// Route configuration helpers
export { createRoutes, createRoute, RouteBuilder, route } from './createRoutes';
export type { RouteConfig } from './createRoutes';

// Router hooks
export { useLocation, useParams, useRouteInfo, useIsActive, useRoutes } from './routerHooks';

// Debug utilities (only the user-facing ones)
export { 
    enableRouterDebugging,
    disableRouterDebugging
} from './logger';
