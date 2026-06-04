/**
 * Workbench layout: panel sizes, widget registration, and widget lifecycle.
 */
import type { WritableDraft } from 'immer';
import type { WidgetContribution, WidgetController } from '../contracts/index.js';
import { WorkbenchArea } from '../domain/enums.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';

export interface WorkbenchWidgetDescriptor {
    id: string;
    title: string;
    defaultArea: WorkbenchArea;
    closable: boolean;
}

export interface WorkbenchState {
    panelSizes: Record<string, number[]>;
    registeredWidgets: Record<string, WorkbenchWidgetDescriptor>;
    areas: Record<WorkbenchArea, string[]>;
    widgetAreaById: Record<string, WorkbenchArea>;
    activeWidgetId: string | null;
}

export interface WorkbenchViewModel {
    panelSizes: Record<string, number[]>;
    activeWidgetId: string | null;
    areas: Record<WorkbenchArea, WorkbenchWidgetDescriptor[]>;
}

const initialState: WorkbenchState = {
    panelSizes: {},
    registeredWidgets: {},
    areas: {
        [WorkbenchArea.Left]: [],
        [WorkbenchArea.Right]: [],
        [WorkbenchArea.Bottom]: [],
        [WorkbenchArea.Center]: [],
    },
    widgetAreaById: {},
    activeWidgetId: null,
};

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

export class WorkbenchEditor extends DomainEditorBase<WorkbenchState> {
    private readonly widgets = new Map<string, WidgetContribution>();
    private readonly widgetControllers = new Map<string, WidgetController>();

    constructor(onCommit: DomainCommitHandler) {
        super(initialState, onCommit);
    }

    setPanelSizes(groupId: string, sizes: number[]): void {
        this.applyWorkbenchChange((d) => {
            d.panelSizes[groupId] = sizes;
        });
    }

    register(widget: WidgetContribution): void {
        this.widgets.set(widget.id, widget);
        this.applyWorkbenchChange((d) => {
            d.registeredWidgets[widget.id] = {
                id: widget.id,
                title: widget.title,
                defaultArea: widget.defaultArea,
                closable: widget.closable,
            };
        });
    }

    unregister(id: string): void {
        this.widgets.delete(id);
        this.applyWorkbenchChange((d) => {
            const area = d.widgetAreaById[id];
            if (!area) return;
            d.areas[area] = d.areas[area].filter((widgetId) => widgetId !== id);
            delete d.widgetAreaById[id];
            if (d.activeWidgetId === id) {
                d.activeWidgetId = d.areas[area][d.areas[area].length - 1] ?? null;
            }
        });
    }

    open(id: string, area?: WorkbenchArea): void {
        this.applyWorkbenchChange((d) => {
            const descriptor = d.registeredWidgets[id];
            const targetArea =
                area ?? descriptor?.defaultArea ?? d.widgetAreaById[id] ?? WorkbenchArea.Center;
            const existingArea = d.widgetAreaById[id];
            if (existingArea) {
                d.areas[existingArea] = d.areas[existingArea].filter((widgetId) => widgetId !== id);
            }
            if (!d.areas[targetArea].includes(id)) {
                d.areas[targetArea] = [...d.areas[targetArea], id];
            }
            d.widgetAreaById[id] = targetArea;
            d.activeWidgetId = id;
        });
    }

    activate(id: string): void {
        if (!this.getState().widgetAreaById[id]) return;
        this.applyWorkbenchChange((d) => {
            d.activeWidgetId = id;
        });
    }

    close(id: string): void {
        this.unregister(id);
    }

    getController(id: string): WidgetController | undefined {
        return this.widgetControllers.get(id);
    }

    getContribution(id: string): WidgetContribution | undefined {
        return this.widgets.get(id);
    }

    /** Restores workbench layout from session without per-step onCommit. */
    restoreFromSession(data: {
        panelSizes?: Record<string, number[]>;
        openWidgetIds: string[];
        activeWidgetId: string | null;
    }): void {
        const prev = this.getState();
        this.patchSilent((d) => {
            if (data.panelSizes) {
                d.panelSizes = { ...data.panelSizes };
            }
            for (const widgetId of data.openWidgetIds) {
                if (!d.registeredWidgets[widgetId]) continue;
                const descriptor = d.registeredWidgets[widgetId];
                const targetArea = descriptor.defaultArea;
                const existingArea = d.widgetAreaById[widgetId];
                if (existingArea) {
                    d.areas[existingArea] = d.areas[existingArea].filter((id) => id !== widgetId);
                }
                if (!d.areas[targetArea].includes(widgetId)) {
                    d.areas[targetArea] = [...d.areas[targetArea], widgetId];
                }
                d.widgetAreaById[widgetId] = targetArea;
            }
            if (data.activeWidgetId && d.widgetAreaById[data.activeWidgetId]) {
                d.activeWidgetId = data.activeWidgetId;
            }
        });
        this.syncLifecycle(prev, this.getState());
    }

    private applyWorkbenchChange(
        recipe: (draft: WritableDraft<WorkbenchState>) => void,
        options?: { silent?: boolean }
    ): void {
        const prev = this.getState();
        if (options?.silent) {
            this.patchSilent(recipe);
        } else {
            this.patch(recipe);
        }
        this.syncLifecycle(prev, this.getState());
    }

    private syncLifecycle(prevState: WorkbenchState, nextState: WorkbenchState): void {
        const prevActive = prevState.activeWidgetId;
        const nextActive = nextState.activeWidgetId;

        if (prevActive && prevActive !== nextActive) {
            this.widgetControllers.get(prevActive)?.onDeactivate?.();
        }
        if (nextActive && prevActive !== nextActive) {
            let controller = this.widgetControllers.get(nextActive);
            if (!controller) {
                const contribution = this.widgets.get(nextActive);
                if (contribution) {
                    controller = contribution.createController({
                        getWidget: (id: string) => this.widgets.get(id),
                    });
                    this.widgetControllers.set(nextActive, controller);
                    controller.onMount?.();
                }
            }
            controller?.onActivate?.();
        }

        const prevOpen = new Set(Object.keys(prevState.widgetAreaById));
        const nextOpen = new Set(Object.keys(nextState.widgetAreaById));
        for (const widgetId of prevOpen) {
            if (!nextOpen.has(widgetId)) {
                const controller = this.widgetControllers.get(widgetId);
                if (controller) {
                    controller.onDeactivate?.();
                    controller.onDispose?.();
                    this.widgetControllers.delete(widgetId);
                }
            }
        }
    }
}
