/**
 * Platform port interfaces.
 * ide-core depends on these abstractions, never on concrete Electron/browser APIs.
 */

export interface StoragePort {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}

export interface FileSystemPort {
    readFile(path: string): Promise<Uint8Array>;
    writeFile(path: string, data: Uint8Array): Promise<void>;
    exists(path: string): Promise<boolean>;
}

export interface IpcPort {
    send(channel: string, payload: unknown): void;
    on(channel: string, handler: (payload: unknown) => void): () => void;
}

export interface KeymapPort {
    registerCommand(commandId: string, keybinding: string): void;
    unregisterCommand(commandId: string): void;
}

export interface TelemetryPort {
    track(event: string, properties?: Record<string, unknown>): void;
}
