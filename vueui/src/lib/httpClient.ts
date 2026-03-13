import axios from 'axios';

const DEFAULT_API_BASE = 'http://localhost:3002/';

let cachedBaseUrl: Promise<string> | null = null;

/**
 * Resolves the Nest API base URL. In Electron this comes from the main process (dynamic port);
 * otherwise uses env or default.
 */
export function getApiBaseUrl(): Promise<string> {
  if (cachedBaseUrl) return cachedBaseUrl;
  const win = typeof window !== 'undefined' ? (window as unknown as { NativeZernikalos?: { getApiBaseUrl?: () => Promise<string> } }) : null;
  if (win?.NativeZernikalos?.getApiBaseUrl) {
    cachedBaseUrl = win.NativeZernikalos.getApiBaseUrl();
  } else {
    cachedBaseUrl = Promise.resolve(import.meta.env.VITE_API_URL || DEFAULT_API_BASE);
  }
  return cachedBaseUrl;
}

export const api = axios.create({
  baseURL: DEFAULT_API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  config.baseURL = await getApiBaseUrl();
  return config;
});
