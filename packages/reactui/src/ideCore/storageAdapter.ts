import type { StoragePort } from '@zstudio/ide-core';

/**
 * StoragePort implementation using localStorage.
 * For use in browser/Electron renderer.
 */
export function createLocalStorageStoragePort(): StoragePort {
    return {
        async get(key: string): Promise<string | null> {
            return localStorage.getItem(key);
        },
        async set(key: string, value: string): Promise<void> {
            localStorage.setItem(key, value);
        },
        async delete(key: string): Promise<void> {
            localStorage.removeItem(key);
        },
    };
}
