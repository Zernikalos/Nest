import pickBy from 'lodash/pickBy';
import type { AssetFormat } from '@ide-core';
import { createEmptyHostPort, type HostPort } from '@ide-core/vue';

type NativeZernikalosApi = NonNullable<Window['NativeZernikalos']>;

/**
 * Maps preload-exposed NativeZernikalos APIs to the ide-core HostPort contract.
 */
export function createElectronHostPort(
    api: NativeZernikalosApi | undefined,
): HostPort {
    if (!api) {
        return createEmptyHostPort();
    }

    return {
        ...createEmptyHostPort(),
        ...pickBy(
            {
                loadZko: api.loadZko ? () => api.loadZko!() : undefined,
                importFile: api.importFile
                    ? (format: AssetFormat) => api.importFile!(format)
                    : undefined,
                openProject: api.openProject
                    ? () => api.openProject!().then((r) => r ?? null)
                    : undefined,
                saveProject: api.saveProject
                    ? (name: string) => api.saveProject!(name).then((r) => r ?? null)
                    : undefined,
                saveBundledScene: api.saveBundledScene
                    ? (fileData: Uint8Array) => api.saveBundledScene!(fileData)
                    : undefined,
                sendMenuContext: api.sendMenuContext,
                getPlatform: api.getPlatform,
                minimizeWindow: api.windowMinimize ? () => void api.windowMinimize!() : undefined,
                maximizeWindow: api.windowMaximize ? () => void api.windowMaximize!() : undefined,
                closeWindow: api.windowClose ? () => void api.windowClose!() : undefined,
                isWindowMaximized: api.windowIsMaximized,
                onWindowMaximizedChanged: api.handleWindowMaximizedChanged
                    ? (callback: (maximized: boolean) => void) => {
                          const sub = api.handleWindowMaximizedChanged!((_ev, maximized) =>
                              callback(maximized),
                          );
                          return () => sub.off();
                      }
                    : undefined,
            },
            (value) => value !== undefined,
        ),
    };
}
