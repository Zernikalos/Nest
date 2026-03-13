import { api } from './httpClient';
import type { Project, IInputAsset } from '@/types/project';

export interface ProjectApiClient {
  createProject(name: string, filePath: string): Promise<Project>;
  getProjectByPath(filePath: string): Promise<Project>;
  addInputAsset(
    filePath: string,
    asset: Omit<IInputAsset, 'id' | 'importedAt'>
  ): Promise<Project>;
}

export async function createProject(
  name: string,
  filePath: string
): Promise<Project> {
  const response = await api.post<Project>('/projects/create', {
    name,
    filePath,
  });
  return response.data;
}

export async function getProjectByPath(filePath: string): Promise<Project> {
  const response = await api.get<Project>('/projects/by-path', {
    params: { filePath },
  });
  return response.data;
}

export async function addInputAsset(
  filePath: string,
  asset: Omit<IInputAsset, 'id' | 'importedAt'>
): Promise<Project> {
  const response = await api.post<Project>('/projects/add-asset', {
    filePath,
    asset,
  });
  return response.data;
}
