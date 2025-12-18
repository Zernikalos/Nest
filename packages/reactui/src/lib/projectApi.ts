import { api } from "./httpClient";

export interface CreateProjectDTO {
    name: string;
    filePath: string;
}

export interface InputAsset {
    id: string
    path: string
    fileName: string
    format: "obj" | "gltf" | "fbx" | "collada"
    importedAt: string
}

export interface ProjectMetadata {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
    assets?: InputAsset[];
}

export async function createProject(name: string, filePath: string): Promise<ProjectMetadata> {
    const response = await api.post<ProjectMetadata>("/projects/create", {
        name,
        filePath,
    });
    return response.data;
}

export async function getProjectByPath(filePath: string): Promise<ProjectMetadata> {
    const response = await api.get<ProjectMetadata>("/projects/by-path", {
        params: { filePath },
    });
    return response.data;
}

export async function addInputAsset(filePath: string, asset: Omit<InputAsset, 'id' | 'importedAt'>): Promise<ProjectMetadata> {
    const response = await api.post<ProjectMetadata>("/projects/add-asset", {
        filePath,
        asset,
    });
    return response.data;
}

