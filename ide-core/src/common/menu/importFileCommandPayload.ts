import type { AssetFormat } from '../domain/enums.js';

/** Payload passed to executeCommand for file import. */
export interface ImportFileCommandPayload {
    format: AssetFormat;
}
