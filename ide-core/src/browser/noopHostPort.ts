import { HostPlatform } from './hostEnums.js';
import type { HostPort } from './hostPort.js';

function definedOverrides(overrides: Partial<HostPort>): Partial<HostPort> {
    const result: Partial<HostPort> = {};
    for (const key of Object.keys(overrides) as (keyof HostPort)[]) {
        const value = overrides[key];
        if (value !== undefined) {
            (result as Record<keyof HostPort, HostPort[keyof HostPort]>)[key] = value;
        }
    }
    return result;
}

/** Default host port with no-op / unresolved promises (web or tests). */
export function createNoOpHostPort(overrides: Partial<HostPort> = {}): HostPort {
    return {
        showSaveProjectDialog: async () => null,
        showOpenProjectDialog: async () => null,
        sendMenuContext: () => {},
        getPlatform: () => HostPlatform.Web,
        isWindowMaximized: async () => false,
        ...definedOverrides(overrides),
    };
}
