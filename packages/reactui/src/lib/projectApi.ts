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

export async function getProjectByPath(filePath: string): Promise<ProjectMetadata> {
    // TODO: Implement backend endpoint for loading project by path
    throw new Error("getProjectByPath is not yet implemented")
}

export interface InputAsset {
    id: string
    path: string
    fileName: string
    format: "obj" | "gltf" | "fbx" | "collada"
    importedAt: string
}

export async function addInputAsset(projectId: string, asset: Omit<InputAsset, 'id' | 'importedAt'>): Promise<ProjectMetadata> {
    // TODO: Implement backend endpoint for adding input asset to project
    throw new Error("addInputAsset is not yet implemented")
}

