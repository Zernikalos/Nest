export type { HostPort, MenuContextSnapshot } from '@ide-core/vue';
export { HostPlatform } from '@ide-core/vue';

/** Vue injection key for the platform host port. */
export const HOST_PORT_KEY = Symbol('hostPort') as symbol;
