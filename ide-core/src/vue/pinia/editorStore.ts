import { defineStore } from 'pinia';
import type { EditorRuntime } from '../../common/runtime/EditorRuntime.js';
import { WorkbenchArea } from '../../common/domain/enums.js';
import type {
    AssetConversionInput,
    IInputAsset,
    TreeNode,
    ZObjectLike,
} from '../../common/domain/types.js';
import type { WidgetContribution } from '../../common/contracts/index.js';
import type { RuntimeEffect } from '../../common/contracts/index.js';
import type { CommandHandler } from '../../common/services/CommandService.js';
import { setupSceneTreePanel as registerSceneTreePanel } from '../setupSceneTreePanel.js';

let editorStoreRuntime: EditorRuntime | null = null;

export function bindEditorStoreRuntime(runtime: EditorRuntime): void {
    editorStoreRuntime = runtime;
}

/**
 * Pinia store: convenience actions over the editor runtime.
 * For reactive state, use `useEditorSlice(key)`; for direct runtime access, `getRuntime()`.
 */
export const useEditorStore = defineStore('editor', () => {
    function getRuntime(): EditorRuntime {
        if (!editorStoreRuntime) {
            throw new Error(
                'Editor store not initialized. Call installEditorStore(pinia, runtime) first.'
            );
        }
        return editorStoreRuntime;
    }

    function selectNodes(ids: string[]): void {
        getRuntime().scene.selectNodes(ids);
    }

    function setTreeFromRoot(root: TreeNode[] | ZObjectLike | undefined): void {
        getRuntime().scene.setTreeFromRoot(root);
    }

    function toggleExpanded(nodeId: string): void {
        getRuntime().scene.toggleExpanded(nodeId);
    }

    function openZObject(nodeId: string, title?: string): void {
        getRuntime().documents.openZObject(nodeId, title);
    }

    function closeDocument(uri: string): void {
        getRuntime().documents.close(uri);
    }

    function setActiveDocument(uri: string | null): void {
        getRuntime().documents.setActive(uri);
    }

    function setPanelSizes(groupId: string, sizes: number[]): void {
        getRuntime().workbench.setPanelSizes(groupId, sizes);
    }

    function registerWorkbenchWidget(widget: WidgetContribution): void {
        getRuntime().workbench.register(widget);
    }

    function openWorkbenchWidget(id: string, area?: WorkbenchArea): void {
        getRuntime().workbench.open(id, area);
    }

    function unregisterWorkbenchWidget(id: string): void {
        getRuntime().workbench.unregister(id);
    }

    function setupSceneTreePanel(
        widgetId = 'scene-tree',
        area: WorkbenchArea = WorkbenchArea.Left
    ): void {
        registerSceneTreePanel(getRuntime(), widgetId, area);
    }

    function getProjectPath(): string | null {
        return getRuntime().project.getPath();
    }

    async function openProject(path: string): Promise<void> {
        await getRuntime().project.open(path);
    }

    async function createProject(name: string, filePath: string): Promise<void> {
        await getRuntime().project.create(name, filePath);
    }

    function closeProject(): void {
        getRuntime().project.close();
    }

    async function addAssetToProject(
        asset: Omit<IInputAsset, 'id' | 'importedAt'>
    ): Promise<void> {
        await getRuntime().project.addAsset(asset);
    }

    async function convertAsset(input: AssetConversionInput) {
        return getRuntime().assetConversion.convert(input);
    }

    function setProjectPersistWarning(message: string | null): void {
        getRuntime().assetConversion.setProjectPersistWarning(message);
    }

    function executeCommand(id: string, payload?: unknown): RuntimeEffect[] {
        return getRuntime().commands.execute(id, payload);
    }

    function registerCommand(id: string, handler: CommandHandler): void {
        getRuntime().commands.register(id, handler);
    }

    function unregisterCommand(id: string): void {
        getRuntime().commands.unregister(id);
    }

    function setContextKey(key: string, value: unknown): void {
        getRuntime().context.set(key, value);
    }

    function evaluateContext(expr: string): boolean {
        return getRuntime().context.evaluate(expr);
    }

    return {
        getRuntime,
        selectNodes,
        setTreeFromRoot,
        toggleExpanded,
        openZObject,
        closeDocument,
        setActiveDocument,
        setPanelSizes,
        registerWorkbenchWidget,
        openWorkbenchWidget,
        unregisterWorkbenchWidget,
        setupSceneTreePanel,
        getProjectPath,
        openProject,
        createProject,
        closeProject,
        addAssetToProject,
        convertAsset,
        setProjectPersistWarning,
        executeCommand,
        registerCommand,
        unregisterCommand,
        setContextKey,
        evaluateContext,
    };
});
