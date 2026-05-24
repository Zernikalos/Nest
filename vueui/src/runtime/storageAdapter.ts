import type { StoragePort } from '@ide-core';

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

/**
 * Storage port that uses Electron IPC to persist in main process (userData).
 * Use when window.NativeZernikalos?.storageGet is available.
 */
export function createElectronStoragePort(): StoragePort {
  const api = typeof window !== 'undefined' ? window.NativeZernikalos : undefined;
  if (!api?.storageGet || !api?.storageSet || !api?.storageDelete) {
    throw new Error('Electron storage API not available');
  }
  return {
    async get(key: string): Promise<string | null> {
      const value = await api!.storageGet!(key);
      return value ?? null;
    },
    async set(key: string, value: string): Promise<void> {
      await api!.storageSet!(key, value);
    },
    async delete(key: string): Promise<void> {
      await api!.storageDelete!(key);
    },
  };
}

export function isElectronStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const api = window.NativeZernikalos;
  return Boolean(api?.storageGet && api?.storageSet && api?.storageDelete);
}
