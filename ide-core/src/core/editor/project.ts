/**
 * Project workspace: path, metadata, loading, and async port operations.
 */
import type { IInputAsset, Project } from '../domain/types.js';
import { withDerived } from '../domain/viewProjection.js';
import type { ProjectPort } from '../ports/index.js';
import type { ContextKeyService } from '../services/ContextKeyService.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';

export interface ProjectState {
    projectFilePath: string | null;
    project: Project | null;
    isLoading: boolean;
    error: Error | null;
}

export type ProjectViewModel = ProjectState & { isProjectOpen: boolean };

const initialState: ProjectState = {
    projectFilePath: null,
    project: null,
    isLoading: false,
    error: null,
};

export function getProjectViewModel(state: ProjectState): ProjectViewModel {
    return withDerived(state, (s) => ({
        isProjectOpen: s.projectFilePath !== null,
    }));
}

export class ProjectEditor extends DomainEditorBase<ProjectState> {
    constructor(
        onCommit: DomainCommitHandler,
        private readonly port: ProjectPort | null,
        private readonly context: ContextKeyService
    ) {
        super(initialState, onCommit);
    }

    getPath(): string | null {
        return this.getState().projectFilePath;
    }

    setPath(path: string | null): void {
        this.patch((d) => {
            d.projectFilePath = path;
            if (path === null) {
                d.project = null;
                d.error = null;
            }
        });
        this.context.set('projectOpen', path !== null);
    }

    private async loadByPath(path: string): Promise<void> {
        if (!this.port) return;
        this.patch((d) => {
            d.isLoading = true;
            d.error = null;
        });
        try {
            const project = await this.port.getProjectByPath(path);
            this.patch((d) => {
                d.project = project;
                d.isLoading = false;
                d.error = null;
            });
        } catch (e) {
            this.patch((d) => {
                d.error = e instanceof Error ? e : new Error(String(e));
                d.isLoading = false;
            });
        }
    }

    async open(path: string): Promise<void> {
        this.setPath(path);
        if (path && this.port) {
            await this.loadByPath(path);
        }
    }

    close(): void {
        this.patch((d) => {
            d.projectFilePath = null;
            d.project = null;
            d.isLoading = false;
            d.error = null;
        });
        this.context.set('projectOpen', false);
    }

    async create(name: string, filePath: string): Promise<void> {
        if (!this.port) throw new Error('Project port not available');
        this.patch((d) => {
            d.isLoading = true;
            d.error = null;
        });
        try {
            await this.port.createProject(name, filePath);
            this.setPath(filePath);
            await this.loadByPath(filePath);
        } catch (e) {
            this.patch((d) => {
                d.error = e instanceof Error ? e : new Error(String(e));
                d.isLoading = false;
            });
            throw e;
        }
    }

    async addAsset(asset: Omit<IInputAsset, 'id' | 'importedAt'>): Promise<void> {
        const path = this.getState().projectFilePath;
        if (!path || !this.port) {
            throw new Error('No project open or project port not available');
        }
        const updated = await this.port.addInputAsset(path, asset);
        this.patch((d) => {
            d.project = updated;
            d.isLoading = false;
            d.error = null;
        });
    }
}
