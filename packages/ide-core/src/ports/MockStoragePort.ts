import type { StoragePort } from './index.js';

/**
 * In-memory StoragePort for tests.
 * No DOM, no Electron.
 */
export class MockStoragePort implements StoragePort {
    private store = new Map<string, string>();

    async get(key: string): Promise<string | null> {
        return this.store.get(key) ?? null;
    }

    async set(key: string, value: string): Promise<void> {
        this.store.set(key, value);
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }
}
