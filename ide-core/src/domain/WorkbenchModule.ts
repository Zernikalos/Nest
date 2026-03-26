/**
 * Workbench module: state and intents for layout areas and widgets.
 * Tracks which widgets are in which area (left/right/bottom/center), panel sizes, and active widget.
 * Widgets are registered by id; the UI maps ids to components.
 */
import { produce } from 'immer';
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';
import type { WorkbenchArea } from './types.js';

/** Intent type constants for the workbench reducer. */
export const SET_PANEL_SIZES = 'workbench/SET_PANEL_SIZES';
export const REGISTER_WIDGET = 'workbench/REGISTER_WIDGET';
export const OPEN_WIDGET = 'workbench/OPEN_WIDGET';
export const CLOSE_WIDGET = 'workbench/CLOSE_WIDGET';
export const ACTIVATE_WIDGET = 'workbench/ACTIVATE_WIDGET';

/** Descriptor for a registered widget (id, title, default area, closable). */
export interface WorkbenchWidgetDescriptor {
    id: string;
    title: string;
    defaultArea: WorkbenchArea;
    closable: boolean;
}

/** Internal state: registered widgets, layout areas, panel sizes, active widget. */
export interface WorkbenchState {
    panelSizes: Record<string, number[]>;
    registeredWidgets: Record<string, WorkbenchWidgetDescriptor>;
    areas: Record<WorkbenchArea, string[]>;
    widgetAreaById: Record<string, WorkbenchArea>;
    activeWidgetId: string | null;
}

const initialState: WorkbenchState = {
    panelSizes: {},
    registeredWidgets: {},
    areas: {
        left: [],
        right: [],
        bottom: [],
        center: [],
    },
    widgetAreaById: {},
    activeWidgetId: null,
};

function reducer(
    state: WorkbenchState,
    intent: RuntimeIntent
): { state: WorkbenchState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case REGISTER_WIDGET: {
            const widget = intent.payload as WorkbenchWidgetDescriptor;
            return {
                state: produce(state, (d) => {
                    d.registeredWidgets[widget.id] = widget;
                }),
                effects: [],
            };
        }
        case SET_PANEL_SIZES: {
            const { groupId, sizes } = intent.payload as {
                groupId: string;
                sizes: number[];
            };
            return {
                state: produce(state, (d) => {
                    d.panelSizes[groupId] = sizes;
                }),
                effects: [],
            };
        }
        case OPEN_WIDGET: {
            const { id, area } = intent.payload as {
                id: string;
                area?: WorkbenchArea;
            };
            return {
                state: produce(state, (d) => {
                    const descriptor = d.registeredWidgets[id];
                    const targetArea =
                        area ?? descriptor?.defaultArea ?? d.widgetAreaById[id] ?? 'center';
                    const existingArea = d.widgetAreaById[id];
                    if (existingArea) {
                        d.areas[existingArea] = d.areas[existingArea].filter((widgetId) => widgetId !== id);
                    }
                    if (!d.areas[targetArea].includes(id)) {
                        d.areas[targetArea] = [...d.areas[targetArea], id];
                    }
                    d.widgetAreaById[id] = targetArea;
                    d.activeWidgetId = id;
                }),
                effects: [],
            };
        }
        case ACTIVATE_WIDGET: {
            const { id } = intent.payload as { id: string };
            if (!state.widgetAreaById[id]) {
                return { state, effects: [] };
            }
            return {
                state: produce(state, (d) => {
                    d.activeWidgetId = id;
                }),
                effects: [],
            };
        }
        case CLOSE_WIDGET: {
            const { id } = intent.payload as { id: string };
            return {
                state: produce(state, (d) => {
                    const area = d.widgetAreaById[id];
                    if (!area) return;
                    d.areas[area] = d.areas[area].filter((widgetId) => widgetId !== id);
                    delete d.widgetAreaById[id];
                    if (d.activeWidgetId === id) {
                        d.activeWidgetId = d.areas[area][d.areas[area].length - 1] ?? null;
                    }
                }),
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

/** View model for the workbench: panel sizes, active widget, and widgets per area for the UI to render. */
export interface WorkbenchViewModel {
    panelSizes: Record<string, number[]>;
    activeWidgetId: string | null;
    areas: Record<WorkbenchArea, WorkbenchWidgetDescriptor[]>;
}

/** Builds the view model from current state. */
export function getWorkbenchViewModel(state: WorkbenchState): WorkbenchViewModel {
    const mapArea = (ids: string[]): WorkbenchWidgetDescriptor[] =>
        ids
            .map((id) => state.registeredWidgets[id])
            .filter((widget): widget is WorkbenchWidgetDescriptor => widget !== undefined);
    return {
        panelSizes: state.panelSizes,
        activeWidgetId: state.activeWidgetId,
        areas: {
            left: mapArea(state.areas.left),
            right: mapArea(state.areas.right),
            bottom: mapArea(state.areas.bottom),
            center: mapArea(state.areas.center),
        },
    };
}
