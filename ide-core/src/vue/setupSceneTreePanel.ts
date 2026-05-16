import type { WorkbenchArea } from '../core/domain/types.js';
import type { EditorRuntime } from '../core/runtime/EditorRuntime.js';
import { createSceneTreeWidgetContribution } from '../core/widgets/SceneTreeWidgetController.js';

export function setupSceneTreePanel(
    runtime: EditorRuntime,
    widgetId = 'scene-tree',
    area: WorkbenchArea = 'left'
): void {
    const contribution = createSceneTreeWidgetContribution(
        runtime.scene,
        () => runtime.getSlice('scene')
    );
    runtime.workbench.register(contribution);
    runtime.workbench.open(widgetId, area);
}
