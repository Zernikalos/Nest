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
