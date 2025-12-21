// Types
export type { Route } from './types';

// Core router exports
export { KeepAliveRouterProvider, useKeepAliveRouter, useNavigate, useCurrentRoute } from './components/KeepAliveRouter';
export { KeepAliveOutlet, useOutletLevel } from './components/KeepAliveOutlet';

// Router components
export { Link, NavLink } from './components/Link';
export { Navigate } from './components/Navigate';

// Route configuration helpers
export { createRoutes, createRoute, RouteBuilder, route } from './utils/createRoutes';
export type { RouteConfig } from './utils/createRoutes';

// Router hooks
export { useLocation, useParams, useRouteInfo, useIsActive, useRoutes, useLastRouteInHierarchy } from './hooks/routerHooks';

// Logger utilities
export { routerLogger, setRouterLogLevel } from './utils/logger';

// Route utilities
export {
    normalizePath,
    joinPaths,
    splitPath,
    getPathUpToLevel,
    isExactMatch,
    isPathPrefix,
    getParentPath,
    getPathDepth,
    resolvePath,
    getQueryParams,
    buildUrl,
    getParentPaths,
    findMatchingRoute,
    flattenRoutes,
} from './utils/routeUtils';

// Route history
export { RouteHistory, useRouteHistory } from './core/routeHistory';

// Navigator
export { Navigator } from './core/navigator';
export type { NavigatorState } from './core/navigator';
export { createNavigatorStore } from './core/navigatorStore';
