import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ProjectsService, ProjectMetadata, InputAsset } from './projects.service';

export class CreateProjectDTO {
    name!: string;
    filePath!: string;
}

export class GetProjectDTO {
    filePath!: string;
}

export class AddInputAssetDTO {
    filePath!: string;
    asset!: Omit<InputAsset, 'id' | 'importedAt'>;
}

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post('create')
    async createProject(@Body() dto: CreateProjectDTO): Promise<ProjectMetadata> {
        return this.projectsService.createProject(dto.name, dto.filePath);
    }

    @Get('by-path')
    async getProjectByPath(@Query('filePath') filePath: string): Promise<ProjectMetadata> {
        return this.projectsService.getProjectByPath(filePath);
    }

    @Post('add-asset')
    async addInputAsset(@Body() dto: AddInputAssetDTO): Promise<ProjectMetadata> {
        return this.projectsService.addInputAsset(dto.filePath, dto.asset);
    }
}

