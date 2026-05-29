import type { StoragePort } from './index.js';

/**
 * In-memory StoragePort implementation for tests and non-persistent scenarios.
 * No DOM, no Electron; all data is lost when the process ends.
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

    /** Clear all entries (test helper; not part of StoragePort). */
    clear(): void {
        this.store.clear();
    }
}
