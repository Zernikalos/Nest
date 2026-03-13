import { api, getApiBaseUrl } from '@/lib/httpClient';

interface FilePath {
  path: string;
  fileName: string;
}

async function buildFileUrl(exposeId: number, fileName: string): Promise<string> {
  const base = await getApiBaseUrl();
  return `${base.replace(/\/$/, '')}/files/${exposeId}/${fileName}`;
}

/**
 * Ask nest server to expose a file and return a URL suitable for zkConvert.
 */
export async function getFileUrl(filePath: FilePath): Promise<string> {
  const response = await api.post<number>('/files/expose', {
    path: filePath.path,
  });
  const exposeId = response.data;
  return buildFileUrl(exposeId, filePath.fileName);
}
