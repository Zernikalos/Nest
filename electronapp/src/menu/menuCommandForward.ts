import { IdeIpcChannel } from '@ide-core/electron';

interface MenuCommandForwardHost {
    sendOnChannel(channel: string, payload?: unknown): void;
}

let getMainWindow: (() => MenuCommandForwardHost | undefined) | undefined;

let registered = false;

/** Registers the main-window forwarder for native menu command clicks (macOS). */
export function registerMenuCommandForward(
    getWindow: () => MenuCommandForwardHost | undefined,
): void {
    if (registered) return;
    registered = true;
    getMainWindow = getWindow;
}

/** Forwards a menu command to the renderer via ide:executeCommand (B1 routing). */
export function emitMenuCommand(commandId: string, payload?: unknown): void {
    const win = getMainWindow?.();
    if (!win) return;
    win.sendOnChannel(IdeIpcChannel.ExecuteCommand, { commandId, payload });
}
