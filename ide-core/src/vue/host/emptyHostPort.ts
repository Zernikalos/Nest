import { HostPlatform } from '../../common/host/enums.js';
import type { HostPort } from './hostPort.js';

/** Default host port with no-op / unresolved promises (web or tests). */
export function createEmptyHostPort(): HostPort {
    return {
        loadZko: async () => null,
        importFile: async () => null,
        openProject: async () => null,
        saveProject: async () => null,
        saveBundledScene: async () => {},
        sendMenuContext: () => {},
        getPlatform: () => HostPlatform.Web,
        isWindowMaximized: async () => false,
    };
}
