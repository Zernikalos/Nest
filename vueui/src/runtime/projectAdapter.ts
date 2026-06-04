import type { AssetFormat, ProjectPort } from '@ide-core';
import * as projectApi from '@/lib/projectApi';

/**
 * Project port implementation that delegates to the Nest projects API (HTTP).
 * Used when creating the editor runtime so project load/create/add-asset live in ide-core.
 */
export function createProjectPort(): ProjectPort {
    return {
        async getProjectByPath(path: string) {
            return projectApi.getProjectByPath(path);
        },
        async createProject(name: string, filePath: string) {
            return projectApi.createProject(name, filePath);
        },
        async addInputAsset(
            filePath: string,
            asset: { path: string; fileName: string; format: AssetFormat }
        ) {
            return projectApi.addInputAsset(filePath, asset);
        },
    };
}
