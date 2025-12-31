import type { ProjectManagerState, Project, InputAsset } from './Project'
import type { ProjectApiClient } from '@/lib/projectApi'
import { QueryClient } from '@tanstack/react-query'
import { projectKeys } from '@/queries/projects'

export class ProjectManager {
    private static instance: ProjectManager | null = null
    private api: ProjectApiClient
    private queryClient: QueryClient
    private state: ProjectManagerState = {
        filePath: null,
        project: null
    }
    private stateListeners: Set<(state: ProjectManagerState) => void> = new Set()

    private constructor(api: ProjectApiClient, queryClient: QueryClient) {
        this.api = api
        this.queryClient = queryClient
    }

    static getInstance(api: ProjectApiClient, queryClient: QueryClient): ProjectManager {
        if (!ProjectManager.instance) {
            ProjectManager.instance = new ProjectManager(api, queryClient)
        }
        return ProjectManager.instance
    }

    async createProject(name: string, filePath: string): Promise<Project> {
        try {
            const project = await this.api.createProject(name, filePath)
            
            // Update QueryClient cache
            this.queryClient.setQueryData(projectKeys.detail(filePath), project)
            
            this.setState({
                filePath,
                project
            })
            return project
        } catch (error) {
            throw error
        }
    }

    async openProject(filePath: string): Promise<Project> {
        try {
            const project = await this.queryClient.fetchQuery({
                queryKey: projectKeys.detail(filePath),
                queryFn: () => this.api.getProjectByPath(filePath),
                staleTime: 30000
            })
            this.setState({
                filePath,
                project
            })
            return project
        } catch (error) {
            throw error
        }
    }

    closeProject(): void {
        this.setState({
            filePath: null,
            project: null
        })
    }

    async refreshProject(): Promise<Project> {
        if (!this.state.filePath) {
            throw new Error('No project is currently open')
        }
        return this.openProject(this.state.filePath)
    }

    async addAssetToProject(asset: Omit<InputAsset, 'id' | 'importedAt'>): Promise<Project> {
        if (!this.state.filePath) {
            throw new Error('No project is currently open')
        }

        try {
            const project = await this.api.addInputAsset(this.state.filePath, asset)
            
            // Update QueryClient cache
            this.queryClient.setQueryData(projectKeys.detail(this.state.filePath), project)
            
            this.setState({
                project
            })
            return project
        } catch (error) {
            throw error
        }
    }

    getState(): ProjectManagerState {
        return { ...this.state }
    }

    onStateChange(listener: (state: ProjectManagerState) => void): () => void {
        this.stateListeners.add(listener)
        return () => this.stateListeners.delete(listener)
    }

    private setState(updates: Partial<ProjectManagerState>): void {
        this.state = { ...this.state, ...updates }
        this.stateListeners.forEach(listener => listener(this.getState()))
    }
}

