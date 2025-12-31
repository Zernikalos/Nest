/**
 * Core Project definitions
 * All types and interfaces related to projects are centralized here
 */

import type { ZkResultExtended } from "@/types/project"
import { ZkoManager } from "./ZkoManager"

/**
 * Asset imported into a project
 */
export interface IInputAsset {
    id: string
    path: string
    fileName: string
    format: "obj" | "gltf" | "fbx" | "collada"
    importedAt: string
}

export class InputAsset implements IInputAsset {
    id: string;
    path: string;
    fileName: string;
    format: "obj" | "gltf" | "fbx" | "collada";
    importedAt: string;

    zkResult?: ZkResultExtended;

    constructor(id: string, path: string, fileName: string, format: "obj" | "gltf" | "fbx" | "collada", importedAt: string) {
        this.id = id;
        this.path = path;
        this.fileName = fileName;
        this.format = format;
        this.importedAt = importedAt;
    }

    static fromJson(json: string): InputAsset {
        return JSON.parse(json);
    }

    toJson(): string {
        return JSON.stringify(this);
    }

    async convertToZko(): Promise<void> {
        const manager = ZkoManager.getInstance();
        this.zkResult = await manager.convertAssetToZko({
            path: this.path,
            fileName: this.fileName,
            format: this.format
        });
    }
}
/**
 * Complete project definition (the actual project data)
 * This represents the full project structure returned from the API
 */
export interface IProject {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
    assets?: InputAsset[];
}

export class Project implements IProject {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
    assets: InputAsset[];

    constructor(name: string, version: string, createdAt: string, lastModified: string, zkBuilderVersion?: string, assets?: InputAsset[]) {
        this.name = name;
        this.version = version;
        this.createdAt = createdAt;
        this.lastModified = lastModified;
        this.zkBuilderVersion = zkBuilderVersion;
        this.assets = assets || [];
    }

    static fromJson(json: string): Project {
        return JSON.parse(json);
    }

    toJson(): string {
        return JSON.stringify(this);
    }

    async convertAssetsToZko(): Promise<void> {
        for (const asset of this.assets) {
            await asset.convertToZko();
        }
    }

    async addAsset(asset: InputAsset): Promise<void> {
        this.assets.push(asset);
        await asset.convertToZko();
    }

    async removeAsset(asset: InputAsset): Promise<void> {
        this.assets = this.assets.filter(a => a.id !== asset.id);
    }

    async getAsset(id: string): Promise<InputAsset | undefined> {
        return this.assets.find(a => a.id === id);
    }
}

/**
 * DTO for creating a new project
 */
export interface CreateProjectDTO {
    name: string;
    filePath: string;
}

/**
 * Internal state managed by ProjectManager
 */
export interface ProjectManagerState {
    filePath: string | null
    project: Project | null
}

