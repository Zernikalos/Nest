import type { RuntimeStore } from '../contracts/index.js';
import type { IInputAsset } from '../domain/types.js';
import {
    CLEAR_PROJECT,
    SET_ERROR,
    SET_LOADING,
    SET_PROJECT,
    SET_PROJECT_PATH,
    type ProjectState,
} from '../domain/ProjectModule.js';
import type { ProjectPort } from '../ports/index.js';
import { ContextKeyService } from '../services/ContextKeyService.js';
import type { StoreDispatcher } from './StoreDispatcher.js';

export class ProjectCoordinator {
    constructor(
        private readonly projectStore: RuntimeStore<ProjectState>,
        private readonly projectPort: ProjectPort | null,
        private readonly contextKeyService: ContextKeyService,
        private readonly dispatcher: StoreDispatcher
    ) {}

    setProjectPath(path: string | null): void {
        this.dispatcher.dispatch(this.projectStore, {
            type: SET_PROJECT_PATH,
            payload: path,
        });
        this.contextKeyService.set('projectOpen', path !== null);
    }

    getProjectPath(): string | null {
        return this.projectStore.getState().projectFilePath;
    }

    async loadByPath(path: string): Promise<void> {
        if (!this.projectPort) return;
        this.dispatcher.dispatch(this.projectStore, { type: SET_LOADING, payload: true });
        try {
            const project = await this.projectPort.getProjectByPath(path);
            this.dispatcher.dispatch(this.projectStore, { type: SET_PROJECT, payload: project });
        } catch (e) {
            this.dispatcher.dispatch(this.projectStore, {
                type: SET_ERROR,
                payload: e instanceof Error ? e : new Error(String(e)),
            });
        }
    }

    async openProject(path: string): Promise<void> {
        this.setProjectPath(path);
        if (path && this.projectPort) {
            await this.loadByPath(path);
        }
    }

    closeProject(): void {
        this.dispatcher.dispatch(this.projectStore, { type: CLEAR_PROJECT });
        this.contextKeyService.set('projectOpen', false);
    }

    async createProject(name: string, filePath: string): Promise<void> {
        if (!this.projectPort) throw new Error('Project port not available');
        this.dispatcher.dispatch(this.projectStore, { type: SET_LOADING, payload: true });
        try {
            await this.projectPort.createProject(name, filePath);
            this.setProjectPath(filePath);
            await this.loadByPath(filePath);
        } catch (e) {
            this.dispatcher.dispatch(this.projectStore, {
                type: SET_ERROR,
                payload: e instanceof Error ? e : new Error(String(e)),
            });
            throw e;
        }
    }

    async addAssetToProject(
        asset: Omit<IInputAsset, 'id' | 'importedAt'>
    ): Promise<void> {
        const path = this.projectStore.getState().projectFilePath;
        if (!path || !this.projectPort) {
            throw new Error('No project open or project port not available');
        }
        const updated = await this.projectPort.addInputAsset(path, asset);
        this.dispatcher.dispatch(this.projectStore, { type: SET_PROJECT, payload: updated });
    }
}
