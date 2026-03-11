/**
 * Platform port interfaces.
 * ide-core depends on these abstractions only; never on concrete Electron, Node, or DOM APIs.
 * Adapters (e.g. vueui, electronapp) provide implementations.
 */

/** Async key-value storage for session and preferences. Implement with localStorage or IPC in Electron. */
export interface StoragePort {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}

/** File system access for reading/writing project or export files. Optional; not used by default runtime. */
export interface FileSystemPort {
    readFile(path: string): Promise<Uint8Array>;
    writeFile(path: string, data: Uint8Array): Promise<void>;
    exists(path: string): Promise<boolean>;
}

/** IPC channel abstraction for main/renderer communication. Optional. */
export interface IpcPort {
    send(channel: string, payload: unknown): void;
    on(channel: string, handler: (payload: unknown) => void): () => void;
}

/** Keybinding registration for commands. Optional; enables platform-specific shortcuts. */
export interface KeymapPort {
    registerCommand(commandId: string, keybinding: string): void;
    unregisterCommand(commandId: string): void;
}

/** Telemetry or analytics. Optional. */
export interface TelemetryPort {
    track(event: string, properties?: Record<string, unknown>): void;
}
