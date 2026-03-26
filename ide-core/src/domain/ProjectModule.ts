/**
 * Project module: state and intents for current workspace/project.
 * Tracks project path, loaded project metadata, loading and error state.
 * Used by the runtime; UI adapters subscribe to the view model.
 */
import { produce } from 'immer';
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';
import type { Project } from './types.js';

/** Intent type constants for the project reducer. */
export const SET_PROJECT_PATH = 'project/SET_PROJECT_PATH';
export const SET_PROJECT = 'project/SET_PROJECT';
export const SET_LOADING = 'project/SET_LOADING';
export const SET_ERROR = 'project/SET_ERROR';
export const CLEAR_PROJECT = 'project/CLEAR_PROJECT';

/** Internal state for the project reducer. */
export interface ProjectState {
    projectFilePath: string | null;
    project: Project | null;
    isLoading: boolean;
    error: Error | null;
}

const initialState: ProjectState = {
    projectFilePath: null,
    project: null,
    isLoading: false,
    error: null,
};

function reducer(
    state: ProjectState,
    intent: RuntimeIntent
): { state: ProjectState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case SET_PROJECT_PATH: {
            const projectFilePath = intent.payload as string | null;
            return {
                state: produce(state, (d) => {
                    d.projectFilePath = projectFilePath;
                    if (projectFilePath === null) {
                        d.project = null;
                        d.error = null;
                    }
                }),
                effects: [],
            };
        }
        case SET_PROJECT: {
            const project = intent.payload as Project | null;
            return {
                state: produce(state, (d) => {
                    d.project = project;
                    d.isLoading = false;
                    d.error = null;
                }),
                effects: [],
            };
        }
        case SET_LOADING: {
            const isLoading = intent.payload as boolean;
            return {
                state: produce(state, (d) => {
                    d.isLoading = isLoading;
                    if (isLoading) d.error = null;
                }),
                effects: [],
            };
        }
        case SET_ERROR: {
            const error = intent.payload as Error | null;
            return {
                state: produce(state, (d) => {
                    d.error = error;
                    d.isLoading = false;
                }),
                effects: [],
            };
        }
        case CLEAR_PROJECT: {
            return {
                state: {
                    ...initialState,
                },
                effects: [],
            };
        }
        default:
            return { state, effects: [] };
    }
}

export function createProjectStore(
    onEffects?: (effects: RuntimeEffect[]) => void
): ReturnType<typeof createStore<ProjectState>> {
    return createStore(initialState, reducer, onEffects);
}

/** View model derived from ProjectState for UI projection. */
export interface ProjectViewModel {
    projectFilePath: string | null;
    project: Project | null;
    isLoading: boolean;
    error: Error | null;
    isProjectOpen: boolean;
}

/** Builds the view model from current state. */
export function getProjectViewModel(state: ProjectState): ProjectViewModel {
    return {
        projectFilePath: state.projectFilePath,
        project: state.project,
        isLoading: state.isLoading,
        error: state.error,
        isProjectOpen: state.projectFilePath !== null,
    };
}
