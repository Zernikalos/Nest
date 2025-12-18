import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface InputAsset {
    id: string;
    path: string;
    fileName: string;
    format: 'obj' | 'gltf' | 'fbx' | 'collada';
    importedAt: string;
}

export interface ProjectMetadata {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
    assets?: InputAsset[];
}

@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    async createProject(name: string, filePath: string): Promise<ProjectMetadata> {
        // Validate project name
        if (!name || name.trim().length === 0) {
            throw new BadRequestException('Project name cannot be empty');
        }

        // Validate file path ends with .zkproj
        if (!filePath.endsWith('.zkproj')) {
            throw new BadRequestException('File path must end with .zkproj extension');
        }

        // Ensure directory exists
        const directory = path.dirname(filePath);
        try {
            await fs.mkdir(directory, { recursive: true });
        } catch (error) {
            this.logger.error(`Failed to create directory: ${directory}`, error);
            throw new InternalServerErrorException('Failed to create project directory');
        }

        // Create project metadata
        const now = new Date().toISOString();
        const projectData: ProjectMetadata = {
            name: name.trim(),
            version: '1.0.0',
            createdAt: now,
            lastModified: now,
            assets: [],
        };

        // Write project file
        try {
            await fs.writeFile(
                filePath,
                JSON.stringify(projectData, null, 4),
                'utf-8'
            );
            this.logger.log(`Project created successfully: ${filePath}`);
            return projectData;
        } catch (error) {
            this.logger.error(`Failed to write project file: ${filePath}`, error);
            throw new InternalServerErrorException('Failed to write project file');
        }
    }

    async getProjectByPath(filePath: string): Promise<ProjectMetadata> {
        // Validate file path ends with .zkproj
        if (!filePath.endsWith('.zkproj')) {
            throw new BadRequestException('File path must end with .zkproj extension');
        }

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const projectData: ProjectMetadata = JSON.parse(fileContent);
            
            // Ensure assets array exists for backward compatibility
            if (!projectData.assets) {
                projectData.assets = [];
            }
            
            this.logger.log(`Project loaded successfully: ${filePath}`);
            return projectData;
        } catch (error) {
            if ((error as any).code === 'ENOENT') {
                throw new NotFoundException(`Project file not found: ${filePath}`);
            }
            this.logger.error(`Failed to read project file: ${filePath}`, error);
            throw new InternalServerErrorException('Failed to read project file');
        }
    }

    async addInputAsset(
        filePath: string,
        asset: Omit<InputAsset, 'id' | 'importedAt'>
    ): Promise<ProjectMetadata> {
        // Validate file path ends with .zkproj
        if (!filePath.endsWith('.zkproj')) {
            throw new BadRequestException('File path must end with .zkproj extension');
        }

        // Validate asset data
        if (!asset.path || !asset.fileName || !asset.format) {
            throw new BadRequestException('Asset must have path, fileName, and format');
        }

        // Load existing project
        const projectData = await this.getProjectByPath(filePath);

        // Check if asset already exists (by path and fileName)
        const existingAsset = projectData.assets?.find(
            (a) => a.path === asset.path && a.fileName === asset.fileName
        );

        if (existingAsset) {
            this.logger.warn(`Asset already exists in project: ${asset.fileName}`);
            // Update the existing asset's importedAt timestamp
            existingAsset.importedAt = new Date().toISOString();
        } else {
            // Create new asset
            const newAsset: InputAsset = {
                id: randomUUID(),
                path: asset.path,
                fileName: asset.fileName,
                format: asset.format,
                importedAt: new Date().toISOString(),
            };

            // Initialize assets array if it doesn't exist
            if (!projectData.assets) {
                projectData.assets = [];
            }

            projectData.assets.push(newAsset);
        }

        // Update lastModified timestamp
        projectData.lastModified = new Date().toISOString();

        // Save updated project file
        try {
            await fs.writeFile(
                filePath,
                JSON.stringify(projectData, null, 4),
                'utf-8'
            );
            this.logger.log(`Asset added to project successfully: ${asset.fileName}`);
            return projectData;
        } catch (error) {
            this.logger.error(`Failed to write project file: ${filePath}`, error);
            throw new InternalServerErrorException('Failed to write project file');
        }
    }
}

