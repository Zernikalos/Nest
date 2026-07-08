import type { IInputAsset, Project } from '../domain/types.js';

/** Project/workspace operations (load, create, add asset). Implement via HTTP to Nest or IPC in Electron. */
export interface ProjectPort {
    getProjectByPath(path: string): Promise<Project>;
    createProject(name: string, filePath: string): Promise<Project>;
    addInputAsset(filePath: string, asset: Omit<IInputAsset, 'id' | 'importedAt'>): Promise<Project>;
}
