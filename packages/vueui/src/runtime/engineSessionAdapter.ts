import type { EngineSessionPort } from '@zstudio/ide-core';

/**
 * Stub implementation of EngineSessionPort.
 * Preview is currently in-page (ZernikalosViewer); no separate engine process.
 * State is updated by the runtime when start/stop/restart are called; this adapter is a no-op.
 * Replace with a real implementation when the host runs the engine in a separate process (e.g. Electron).
 */
export function createEngineSessionPort(): EngineSessionPort {
  return {
    async startEngineSession() {
      // No-op: in-page viewer does not require start; runtime will set status to 'running'
    },
    async stopEngineSession() {
      // No-op
    },
    async restartEngineSession() {
      // No-op
    },
  };
}
