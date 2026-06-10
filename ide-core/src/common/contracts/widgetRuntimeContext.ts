import type { WidgetContribution } from './widgetContribution.js';

/** Context passed to a widget when its controller is created. */
export interface WidgetRuntimeContext {
    getWidget(id: string): WidgetContribution | undefined;
}
