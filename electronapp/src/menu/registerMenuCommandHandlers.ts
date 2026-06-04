import _ from 'lodash';
import { CommandId } from '@ide-core';
import { IdeIpcChannel } from '@ide-core/electron';
import { mainBus } from '../events/mainBus';
import { runImportFileDialog, runLoadZkoDialog, runOpenProjectDialog } from './menuActions';
import type { MenuCommandPayload } from './nativeMenuBus';

export interface MenuCommandMainWindowHost {
    getBrowserWindow(): Electron.BrowserWindow;
    sendOnChannel(channel: string, payload?: unknown): void;
}

function runAsyncHandler(fn: () => Promise<void>): void {
    void fn().catch((err) => {
        console.error('[menu:command] handler failed:', err);
    });
}

let handlersRegistered = false;

export function registerMenuCommandHandlers(
    getMainWindow: () => MenuCommandMainWindowHost | undefined,
): void {
    if (handlersRegistered) return;
    handlersRegistered = true;

    mainBus.on('menu:command', ({ commandId, payload }) => {
        runAsyncHandler(async () => {
            const win = getMainWindow();
            if (!win) return;

            switch (commandId) {
                case CommandId.FILE_LOAD_ZKO: {
                    const result = await runLoadZkoDialog(win.getBrowserWindow());
                    if (_.isNil(result)) return;
                    win.sendOnChannel(IdeIpcChannel.ExecuteCommand, {
                        commandId,
                        payload: result,
                    });
                    return;
                }
                case CommandId.FILE_IMPORT_FILE: {
                    const format = (payload as MenuCommandPayload | undefined)?.format;
                    if (!format) return;
                    const result = await runImportFileDialog(win.getBrowserWindow(), format);
                    if (_.isNil(result)) return;
                    win.sendOnChannel(IdeIpcChannel.ExecuteCommand, {
                        commandId,
                        payload: result,
                    });
                    return;
                }
                case CommandId.FILE_OPEN_PROJECT: {
                    const filePath = await runOpenProjectDialog(win.getBrowserWindow());
                    if (_.isNil(filePath)) return;
                    win.sendOnChannel(IdeIpcChannel.ExecuteCommand, {
                        commandId,
                        payload: { filePath },
                    });
                    return;
                }
                case CommandId.FILE_BUNDLE_SCENE:
                case CommandId.FILE_CREATE_PROJECT: {
                    win.sendOnChannel(IdeIpcChannel.ExecuteCommand, { commandId });
                    return;
                }
                default: {
                    // Ignore unknown menu command ids.
                }
            }
        });
    });
}
