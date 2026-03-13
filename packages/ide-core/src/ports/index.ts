/**
 * Platform port interfaces.
 * ide-core depends on these abstractions only; never on concrete Electron, Node, or DOM APIs.
 * Adapters (e.g. vueui, electronapp) provide implementations.
 */

import type {
    AssetConversionInput,
    AssetConversionResult,
    IInputAsset,
    Project,
} from '../domain/types.js';

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

/** Project/workspace operations (load, create, add asset). Implement via HTTP to Nest or IPC in Electron. */
export interface ProjectPort {
    getProjectByPath(path: string): Promise<Project>;
    createProject(name: string, filePath: string): Promise<Project>;
    addInputAsset(filePath: string, asset: Omit<IInputAsset, 'id' | 'importedAt'>): Promise<Project>;
}

/** Asset conversion from external format (gltf, obj, etc.) to ZKO. Implement via zkConvert/zkExport or backend. */
export interface AssetConversionPort {
    convertToZko(input: AssetConversionInput): Promise<AssetConversionResult>;
}

/** Options for starting an engine session (e.g. preview). Domain-level; no process/spawn details. */
export interface EngineSessionStartOptions {
    projectPath?: string;
}

/** Engine session lifecycle (start/stop/restart). Implement with in-page viewer or separate process (e.g. Electron). */
export interface EngineSessionPort {
    startEngineSession(options?: EngineSessionStartOptions): Promise<void>;
    stopEngineSession(): Promise<void>;
    restartEngineSession(): Promise<void>;
}
