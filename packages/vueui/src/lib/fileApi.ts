import { api } from '@/lib/httpClient';

interface FilePath {
  path: string;
  fileName: string;
}

function buildFileUrl(exposeId: number, fileName: string): string {
  return `http://localhost:3002/files/${exposeId}/${fileName}`;
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
