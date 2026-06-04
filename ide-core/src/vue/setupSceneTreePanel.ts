import { WorkbenchArea } from '../common/domain/enums.js';
import type { EditorRuntime } from '../common/runtime/EditorRuntime.js';
import { createSceneTreeWidgetContribution } from '../common/widgets/SceneTreeWidgetController.js';

export function setupSceneTreePanel(
    runtime: EditorRuntime,
    widgetId = 'scene-tree',
    area: WorkbenchArea = WorkbenchArea.Left
): void {
    const contribution = createSceneTreeWidgetContribution(
        runtime.scene,
        () => runtime.getSlice('scene')
    );
    runtime.workbench.register(contribution);
    runtime.workbench.open(widgetId, area);
}
