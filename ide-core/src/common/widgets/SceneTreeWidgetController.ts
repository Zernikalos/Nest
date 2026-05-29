import type { WidgetContribution, WidgetController } from '../contracts/index.js';
import { WorkbenchArea } from '../domain/enums.js';
import type { SceneTreeEditor, SceneTreeViewModel } from '../editor/sceneTree.js';

export interface SceneTreeWidgetViewModel
    extends Pick<
        SceneTreeViewModel,
        'tree' | 'selectedIds' | 'activeNode' | 'expandedNodeIds' | 'focusedNodeId' | 'openedNodes'
    > {}

export class SceneTreeWidgetController implements WidgetController {
    constructor(
        private readonly scene: SceneTreeEditor,
        private readonly getSceneViewModel: () => SceneTreeViewModel
    ) {}

    onMount(): void {}

    onActivate(): void {}

    onDeactivate(): void {}

    onDispose(): void {}

    serializeState(): unknown {
        return {};
    }

    restoreState(): void {}

    getViewModel(): SceneTreeWidgetViewModel {
        const vm = this.getSceneViewModel();
        return {
            tree: vm.tree,
            selectedIds: vm.selectedIds,
            activeNode: vm.activeNode,
            expandedNodeIds: vm.expandedNodeIds,
            focusedNodeId: vm.focusedNodeId,
            openedNodes: vm.openedNodes,
        };
    }

    selectNodes(ids: string[]): void {
        this.scene.selectNodes(ids);
    }

    toggleExpanded(nodeId: string): void {
        this.scene.toggleExpanded(nodeId);
    }
}

export function createSceneTreeWidgetContribution(
    scene: SceneTreeEditor,
    getSceneViewModel: () => SceneTreeViewModel
): WidgetContribution {
    return {
        id: 'scene-tree',
        title: 'Scene Tree',
        defaultArea: WorkbenchArea.Left,
        closable: false,
        createController: () =>
            new SceneTreeWidgetController(scene, getSceneViewModel),
    };
}
