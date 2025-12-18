import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface ProjectMetadata {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
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
}

