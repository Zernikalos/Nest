import type { AssetFormat } from '@ide-core';
import { mainBus } from '../events/mainBus';

export interface MenuCommandPayload {
    format: AssetFormat;
}

export function emitMenuCommand(commandId: string, payload?: MenuCommandPayload): void {
    mainBus.emit('menu:command', { commandId, payload });
}
