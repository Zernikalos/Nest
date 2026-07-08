import type { WorkbenchArea } from '../domain/enums.js';
import type { WidgetController } from './widgetController.js';
import type { WidgetRuntimeContext } from './widgetRuntimeContext.js';

/** Registration descriptor for a workbench widget. */
export interface WidgetContribution {
    id: string;
    title: string;
    defaultArea: WorkbenchArea;
    closable: boolean;
    createController(ctx: WidgetRuntimeContext): WidgetController;
}
