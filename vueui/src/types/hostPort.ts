export type { HostPort, MenuContextSnapshot } from '@ide-core/browser';
export { HostPlatform } from '@ide-core/browser';

/** Vue injection key for the platform host port. */
export const HOST_PORT_KEY = Symbol('hostPort') as symbol;
