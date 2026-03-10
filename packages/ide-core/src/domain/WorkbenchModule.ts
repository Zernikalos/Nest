import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';

export const SET_PANEL_SIZES = 'workbench/SET_PANEL_SIZES';

export interface WorkbenchState {
    panelSizes: Record<string, number[]>;
}

const initialState: WorkbenchState = {
    panelSizes: {},
};

function reducer(
    state: WorkbenchState,
    intent: RuntimeIntent
): { state: WorkbenchState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case SET_PANEL_SIZES: {
            const { groupId, sizes } = intent.payload as {
                groupId: string;
                sizes: number[];
            };
            return {
                state: {
                    ...state,
                    panelSizes: { ...state.panelSizes, [groupId]: sizes },
                },
                effects: [],
            };
        }
        default:
            return { state, effects: [] };
    }
}

export function createWorkbenchStore(
    onEffects?: (effects: RuntimeEffect[]) => void
): ReturnType<typeof createStore<WorkbenchState>> {
    return createStore(initialState, reducer, onEffects);
}

export interface WorkbenchViewModel {
    panelSizes: Record<string, number[]>;
}

export function getWorkbenchViewModel(state: WorkbenchState): WorkbenchViewModel {
    return {
        panelSizes: state.panelSizes,
    };
}
