/** IPC channel abstraction for main/renderer communication. Optional. */
export interface IpcPort {
    send(channel: string, payload: unknown): void;
    on(channel: string, handler: (payload: unknown) => void): () => void;
}
