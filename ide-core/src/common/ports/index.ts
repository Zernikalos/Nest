/**
 * Platform port interfaces.
 * ide-core depends on these abstractions only; never on concrete Electron, Node, or DOM APIs.
 * Adapters (e.g. vueui, electronapp) provide implementations.
 */

export type { StoragePort } from './StoragePort.js';
export type { FileSystemPort } from './FileSystemPort.js';
export type { IpcPort } from './IpcPort.js';
export type { KeymapPort } from './KeymapPort.js';
export type { TelemetryPort } from './TelemetryPort.js';
export type { ProjectPort } from './ProjectPort.js';
export type { AssetConversionPort } from './AssetConversionPort.js';
export type { EngineSessionPort, EngineSessionStartOptions } from './EngineSessionPort.js';
