import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService, ProjectMetadata } from './projects.service';

export class CreateProjectDTO {
    name!: string;
    filePath!: string;
}

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post('create')
    async createProject(@Body() dto: CreateProjectDTO): Promise<ProjectMetadata> {
        return this.projectsService.createProject(dto.name, dto.filePath);
    }
}

