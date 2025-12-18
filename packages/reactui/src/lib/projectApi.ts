import { api } from "./httpClient";

export interface CreateProjectDTO {
    name: string;
    filePath: string;
}

export interface ProjectMetadata {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
}

export async function createProject(name: string, filePath: string): Promise<ProjectMetadata> {
    const response = await api.post<ProjectMetadata>("/projects/create", {
        name,
        filePath,
    });
    return response.data;
}

