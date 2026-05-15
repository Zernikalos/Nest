import type { RuntimeEffect, RuntimeStore } from '../contracts/index.js';
import type { WorkbenchIntent } from '../contracts/intents.js';
import type { WidgetContribution, WidgetController } from '../contracts/index.js';
import {
    CLOSE_WIDGET,
    OPEN_WIDGET,
    REGISTER_WIDGET,
    type WorkbenchState,
} from '../domain/WorkbenchModule.js';
import type { WorkbenchArea } from '../domain/types.js';
import type { StoreDispatcher } from './StoreDispatcher.js';

export class WidgetLifecycleManager {
    private readonly widgets = new Map<string, WidgetContribution>();
    private readonly widgetControllers = new Map<string, WidgetController>();

    constructor(
        private readonly workbenchStore: RuntimeStore<WorkbenchState>,
        private readonly dispatcher: StoreDispatcher
    ) {}

    register(widget: WidgetContribution): RuntimeEffect[] {
        this.widgets.set(widget.id, widget);
        return this.dispatch({
            type: REGISTER_WIDGET,
            payload: {
                id: widget.id,
                title: widget.title,
                defaultArea: widget.defaultArea,
                closable: widget.closable,
            },
        });
    }

    unregister(id: string): RuntimeEffect[] {
        this.widgets.delete(id);
        return this.dispatch({ type: CLOSE_WIDGET, payload: { id } });
    }

    open(id: string, area?: WorkbenchArea): RuntimeEffect[] {
        return this.dispatch({ type: OPEN_WIDGET, payload: { id, area } });
    }

    dispatch(intent: WorkbenchIntent): RuntimeEffect[] {
        const prevState = this.workbenchStore.getState();
        const effects = this.dispatcher.dispatch(this.workbenchStore, intent);
        const nextState = this.workbenchStore.getState();
        this.syncLifecycle(prevState, nextState);
        return effects;
    }

    private syncLifecycle(
        prevState: WorkbenchState,
        nextState: WorkbenchState
    ): void {
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
