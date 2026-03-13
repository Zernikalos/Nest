import { api } from '@/lib/httpClient';

/**
 * Get the debug key from the nest server for connecting devices to the debugger.
 */
export async function getDebugKey(): Promise<string> {
  const response = await api.get<string>('/nest/key');
  return response.data;
}
