// Core router exports
export { KeepAliveRouterProvider, useKeepAliveRouter, useNavigate, useCurrentRoute } from './KeepAliveRouter';
export { KeepAliveOutlet } from './KeepAliveOutlet';
export type { Route } from './KeepAliveRouter';

// Enhanced router components (react-router-dom style)
export { Link, NavLink } from './Link';
export { Navigate } from './Navigate';

// Route configuration helpers
export { createRoutes, createRoute, RouteBuilder, route } from './createRoutes';
export type { RouteConfig } from './createRoutes';

// Enhanced hooks (react-router-dom style)
export { useLocation, useParams, useRouteInfo, useIsActive, useRoutes } from './routerHooks';

// Legacy hooks (for backward compatibility)
export { useCustomNavigate, useCurrentRouteInfo } from './hooks';
