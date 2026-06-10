/** Async key-value storage for session and preferences. Implement with localStorage or IPC in Electron. */
export interface StoragePort {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}
