/**
 * Factory for the editor runtime. Framework-agnostic; used by React and Vue adapters.
 *
 * The runtime is the single source of truth for scene tree, workbench, documents, commands,
 * and context keys. UI adapters subscribe to view models and dispatch intents; they do not
 * hold canonical editor state. Optional StoragePort enables session persistence (e.g. localStorage
 * or Electron main process). Document URIs use the scheme zobject://nodeId for scene nodes.
 */
import type {
    AssetConversionInput,
    IInputAsset,
    TreeNode,
    ZObjectLike,
} from './domain/types.js';
import type {
    AssetConversionPort,
    EngineSessionPort,
    ProjectPort,
    StoragePort,
} from './ports/index.js';
import type { SessionData } from './services/SessionService.js';
import type { CommandHandler } from './services/CommandService.js';
import {
    CLOSE_TAB,
    OPEN_TAB,
    SELECT_NODES,
    SET_ACTIVE_TAB,
    SET_TREE,
    TOGGLE_NODE_EXPANDED,
    createSceneTreeStore,
    getSceneTreeViewModel,
} from './domain/SceneTreeModule.js';
import {
    ACTIVATE_WIDGET,
    CLOSE_WIDGET,
    OPEN_WIDGET,
    REGISTER_WIDGET,
    SET_PANEL_SIZES,
    createWorkbenchStore,
    getWorkbenchViewModel,
} from './domain/WorkbenchModule.js';
import {
    CLOSE_DOCUMENT,
    type DocumentRecord,
    OPEN_DOCUMENT,
    RESTORE_DOCUMENTS,
    SET_ACTIVE_DOCUMENT,
    createDocumentStore,
    getDocumentViewModel,
} from './domain/DocumentModule.js';
import {
    CLEAR_PROJECT,
    SET_ERROR,
    SET_LOADING,
    SET_PROJECT,
    SET_PROJECT_PATH,
    createProjectStore,
    getProjectViewModel,
} from './domain/ProjectModule.js';
import type { ProjectViewModel } from './domain/ProjectModule.js';
import {
    SET_CONVERSION_ERROR,
    SET_CONVERSION_RESULT,
    SET_PROJECT_PERSIST_WARNING,
    START_CONVERSION,
    createAssetConversionStore,
    getAssetConversionViewModel,
} from './domain/AssetConversionModule.js';
import type { AssetConversionViewModel } from './domain/AssetConversionModule.js';
import {
    SET_ERROR as ENGINE_SESSION_SET_ERROR,
    SET_STATUS as ENGINE_SESSION_SET_STATUS,
    createEngineSessionStore,
    getEngineSessionViewModel,
} from './domain/EngineSessionModule.js';
import type { EngineSessionViewModel } from './domain/EngineSessionModule.js';
import { convertZObjectToTreeNode, findNodeById } from './domain/sceneTreeUtils.js';
import { SessionService } from './services/SessionService.js';
import { CommandService } from './services/CommandService.js';
import { ContextKeyService } from './services/ContextKeyService.js';
import type { RuntimeEffect, WidgetContribution, WidgetController } from './contracts/index.js';
import type { WorkbenchArea } from './domain/types.js';
import type { SceneTreeState, SceneTreeViewModel } from './domain/SceneTreeModule.js';
import type { WorkbenchViewModel } from './domain/WorkbenchModule.js';
import type { DocumentState, DocumentViewModel } from './domain/DocumentModule.js';

export interface EditorRuntimePorts {
    /** If provided, session (scene tree, workbench, documents) is persisted and restored. */
    storage?: StoragePort;
    /** If provided, project load/create/add-asset operations are delegated to this port. */
    project?: ProjectPort;
    /** If provided, asset-to-ZKO conversion is delegated to this port. */
    assetConversion?: AssetConversionPort;
    /** If provided, engine session start/stop/restart is delegated to this port (e.g. preview). */
    engineSession?: EngineSessionPort;
}

/**
 * Public API of the editor runtime. Explicit interface so adapters get a stable type (e.g. unregisterCommand).
 * All behavior is implemented here or in services; no framework or DOM dependencies.
 */
export interface EditorRuntime {
    executeCommand(id: string, payload?: unknown): RuntimeEffect[];
    registerCommand(id: string, handler: CommandHandler): void;
    unregisterCommand(id: string): void;
    hasCommand(id: string): boolean;
    contextKey: {
        set(key: string, value: unknown): void;
        get(key: string): unknown;
        getBool(key: string): boolean;
        evaluate(expr: string): boolean;
    };
    getSceneTreeState(): SceneTreeState;
    getSceneTreeViewModel(): SceneTreeViewModel;
    subscribeSceneTree(listener: () => void): () => void;
    dispatchSceneTree(intent: { type: string; payload?: unknown }): RuntimeEffect[];
    setTreeFromRoot(root: ZObjectLike | undefined): void;
    getWorkbenchViewModel(): WorkbenchViewModel;
    subscribeWorkbench(listener: () => void): () => void;
    dispatchWorkbench(intent: { type: string; payload?: unknown }): RuntimeEffect[];
    registerWidget(widget: WidgetContribution): void;
    unregisterWidget(id: string): void;
    openWidget(id: string, area?: WorkbenchArea): RuntimeEffect[];
    closeWidget(id: string): RuntimeEffect[];
    activateWidget(id: string): RuntimeEffect[];
    getDocumentState(): DocumentState;
    getDocumentViewModel(): DocumentViewModel;
    subscribeDocuments(listener: () => void): () => void;
    dispatchDocuments(intent: { type: string; payload?: unknown }): RuntimeEffect[];
    sessionSave(): Promise<void>;
    sessionRestore(): Promise<SessionData | null>;
    hydrateSession(): Promise<void>;
    setWorkspace(path: string | null): void;
    getWorkspace(): string | null;
    setProjectPath(path: string | null): void;
    getProjectPath(): string | null;
    getProjectViewModel(): ProjectViewModel;
    subscribeProject(listener: () => void): () => void;
    openProject(path: string): Promise<void>;
    closeProject(): void;
    createProject(name: string, filePath: string): Promise<void>;
    addAssetToProject(asset: Omit<IInputAsset, 'id' | 'importedAt'>): Promise<void>;
    getAssetConversionViewModel(): AssetConversionViewModel;
    subscribeAssetConversion(listener: () => void): () => void;
    /** Set or clear a non-fatal project persistence warning (e.g. import blocked, dismiss banner). */
    setProjectPersistWarning(message: string | null): void;
    convertAsset(input: AssetConversionInput): Promise<AssetConversionViewModel['lastResult']>;
    getEngineSessionViewModel(): EngineSessionViewModel;
    subscribeEngineSession(listener: () => void): () => void;
    startEngine(): Promise<void>;
    stopEngine(): Promise<void>;
    restartEngine(): Promise<void>;
}

/** Collect all node ids from a tree (for validating session data). */
function collectTreeIds(nodes: { id: string; children?: unknown[] }[]): Set<string> {
    const ids = new Set<string>();
    const collect = (currentNodes: { id: string; children?: unknown[] }[]) => {
        for (const node of currentNodes) {
            ids.add(node.id);
            if (node.children) {
                collect(node.children as { id: string; children?: unknown[] }[]);
            }
        }
    };
    collect(nodes);
    return ids;
}

/** Map a scene node id to a document URI (zobject://id). */
function nodeIdToDocumentUri(nodeId: string): string {
    return `zobject://${nodeId}`;
}

/** Extract node id from a zobject:// URI, or null if not a zobject URI. */
function documentUriToNodeId(uri: string): string | null {
    return uri.startsWith('zobject://') ? uri.slice('zobject://'.length) : null;
}

/**
 * Creates the editor runtime. Pass optional ports (e.g. storage) for persistence.
 * @param ports - Optional platform ports; storage enables session save/restore
 * @returns The runtime instance (commands, view models, dispatch, workspace, session)
 */
export function createEditorRuntime(ports?: EditorRuntimePorts): EditorRuntime {
    const sceneTreeStore = createSceneTreeStore();
    const workbenchStore = createWorkbenchStore();
    const documentStore = createDocumentStore();
    const projectStore = createProjectStore();
    const assetConversionStore = createAssetConversionStore();
    const commandService = new CommandService();
    const contextKeyService = new ContextKeyService();
    const sessionService = ports?.storage ? new SessionService(ports.storage) : null;
    const projectPort = ports?.project ?? null;
    const assetConversionPort = ports?.assetConversion ?? null;
    const engineSessionPort = ports?.engineSession ?? null;
    const engineSessionStore = createEngineSessionStore();
    const widgets = new Map<string, WidgetContribution>();
    const widgetControllers = new Map<string, WidgetController>();

    /** Load project from port when path is set and port is available. */
    const loadProjectByPath = async (path: string) => {
        if (!projectPort) return;
        projectStore.dispatch({ type: SET_LOADING, payload: true });
        try {
            const project = await projectPort.getProjectByPath(path);
            projectStore.dispatch({ type: SET_PROJECT, payload: project });
        } catch (e) {
            projectStore.dispatch({
                type: SET_ERROR,
                payload: e instanceof Error ? e : new Error(String(e)),
            });
        }
    };

    const setProjectPath = (path: string | null) => {
        projectStore.dispatch({ type: SET_PROJECT_PATH, payload: path });
        contextKeyService.set('projectOpen', path !== null);
    };

    const setWorkspace = (path: string | null) => {
        setProjectPath(path);
    };

    const getWorkspace = () => projectStore.getState().projectFilePath;
    const getProjectPath = () => projectStore.getState().projectFilePath;

    let sessionHydrated = false;
    let hydrationPromise: Promise<void> | null = null;
    let persistTimer: ReturnType<typeof setTimeout> | null = null;

    /** Debounced session save (250ms) to avoid thrashing storage. */
    const scheduleSessionSave = () => {
        if (!sessionService) return;
        if (persistTimer) clearTimeout(persistTimer);
        persistTimer = setTimeout(() => {
            void saveSessionSnapshot();
        }, 250);
    };

    /** When scene tree intents open/close/activate tabs, sync the document store (zobject URIs). */
    const syncDocumentFromSceneIntent = (intent: { type: string; payload?: unknown }) => {
        if (intent.type === OPEN_TAB) {
            const nodeId = intent.payload as string;
            const node = findNodeById(sceneTreeStore.getState().tree, nodeId);
            documentStore.dispatch({
                type: OPEN_DOCUMENT,
                payload: {
                    uri: nodeIdToDocumentUri(nodeId),
                    title: node?.label ?? nodeId,
                },
            });
            return;
        }
        if (intent.type === CLOSE_TAB) {
            const nodeId = intent.payload as string;
            documentStore.dispatch({
                type: CLOSE_DOCUMENT,
                payload: { uri: nodeIdToDocumentUri(nodeId) },
            });
            return;
        }
        if (intent.type === SELECT_NODES || intent.type === SET_ACTIVE_TAB) {
            const activeNode = sceneTreeStore.getState().activeNode;
            documentStore.dispatch({
                type: SET_ACTIVE_DOCUMENT,
                payload: { uri: activeNode ? nodeIdToDocumentUri(activeNode) : null },
            });
        }
    };

    const dispatchSceneTreeIntent = (intent: { type: string; payload?: unknown }) => {
        const effects = sceneTreeStore.dispatch(intent);
        syncDocumentFromSceneIntent(intent);
        scheduleSessionSave();
        return effects;
    };

    const dispatchWorkbenchIntent = (intent: { type: string; payload?: unknown }) => {
        const prevState = workbenchStore.getState();
        const effects = workbenchStore.dispatch(intent);
        const nextState = workbenchStore.getState();
        const prevActive = prevState.activeWidgetId;
        const nextActive = nextState.activeWidgetId;

        if (prevActive && prevActive !== nextActive) {
            widgetControllers.get(prevActive)?.onDeactivate?.();
        }
        if (nextActive && prevActive !== nextActive) {
            let controller = widgetControllers.get(nextActive);
            if (!controller) {
                const contribution = widgets.get(nextActive);
                if (contribution) {
                    controller = contribution.createController({
                        getWidget: (id: string) => widgets.get(id),
                    });
                    widgetControllers.set(nextActive, controller);
                    controller.onMount?.();
                }
            }
            controller?.onActivate?.();
        }

        const prevOpen = new Set(Object.keys(prevState.widgetAreaById));
        const nextOpen = new Set(Object.keys(nextState.widgetAreaById));
        for (const widgetId of prevOpen) {
            if (!nextOpen.has(widgetId)) {
                const controller = widgetControllers.get(widgetId);
                if (controller) {
                    controller.onDeactivate?.();
                    controller.onDispose?.();
                    widgetControllers.delete(widgetId);
                }
            }
        }
        scheduleSessionSave();
        return effects;
    };

    const dispatchDocumentIntent = (intent: { type: string; payload?: unknown }) => {
        const effects = documentStore.dispatch(intent);
        if (intent.type === OPEN_DOCUMENT || intent.type === SET_ACTIVE_DOCUMENT) {
            const activeUri = documentStore.getState().activeUri;
            const nodeId = activeUri ? documentUriToNodeId(activeUri) : null;
            if (nodeId) {
                sceneTreeStore.dispatch({ type: OPEN_TAB, payload: nodeId });
                sceneTreeStore.dispatch({ type: SET_ACTIVE_TAB, payload: nodeId });
            }
        }
        if (intent.type === CLOSE_DOCUMENT) {
            const uri = (intent.payload as { uri: string }).uri;
            const nodeId = documentUriToNodeId(uri);
            if (nodeId) {
                sceneTreeStore.dispatch({ type: CLOSE_TAB, payload: nodeId });
            }
        }
        scheduleSessionSave();
        return effects;
    };

    /** Apply a restored session snapshot to the stores (used after restore/hydrate). */
    const applySession = (data: SessionData) => {
        const state = sceneTreeStore.getState();
        const treeIds = collectTreeIds(state.tree);

        const selectedIds = (data.sceneTree.selectedIds ?? []).filter((id) => treeIds.has(id));
        if (selectedIds.length > 0) {
            sceneTreeStore.dispatch({ type: SELECT_NODES, payload: selectedIds });
        }

        const validOpened = data.sceneTree.openedNodeIds.filter((id) => treeIds.has(id));
        for (const id of validOpened) {
            sceneTreeStore.dispatch({ type: OPEN_TAB, payload: id });
        }

        if (data.sceneTree.activeNode && treeIds.has(data.sceneTree.activeNode)) {
            sceneTreeStore.dispatch({ type: SET_ACTIVE_TAB, payload: data.sceneTree.activeNode });
        }

        const expanded = (data.sceneTree.expandedNodeIds ?? []).filter((id) => treeIds.has(id));
        const alreadyExpanded = new Set(sceneTreeStore.getState().expandedNodeIds);
        for (const id of expanded) {
            if (!alreadyExpanded.has(id)) {
                sceneTreeStore.dispatch({ type: TOGGLE_NODE_EXPANDED, payload: id });
            }
        }

        if (data.workbench) {
            if (data.workbench.panelSizes) {
                for (const [groupId, sizes] of Object.entries(data.workbench.panelSizes)) {
                    workbenchStore.dispatch({
                        type: SET_PANEL_SIZES,
                        payload: { groupId, sizes },
                    });
                }
            }
            for (const widgetId of data.workbench.openWidgetIds) {
                workbenchStore.dispatch({ type: OPEN_WIDGET, payload: { id: widgetId } });
            }
            if (data.workbench.activeWidgetId) {
                workbenchStore.dispatch({
                    type: ACTIVATE_WIDGET,
                    payload: { id: data.workbench.activeWidgetId },
                });
            }
        }

        if (data.documents) {
            documentStore.dispatch({
                type: RESTORE_DOCUMENTS,
                payload: {
                    documents: data.documents.opened,
                    activeUri: data.documents.activeUri,
                },
            });
        }
    };

    /** Load session from storage once and apply it; idempotent. */
    const hydrateSession = async (): Promise<void> => {
        if (!sessionService || sessionHydrated) return;
        if (hydrationPromise) return hydrationPromise;
        hydrationPromise = (async () => {
            const data = await sessionService.restore();
            if (data) {
                applySession(data);
            }
            sessionHydrated = true;
        })();
        await hydrationPromise;
    };

    /** Serialize current scene tree, workbench, and documents to storage. */
    const saveSessionSnapshot = async (): Promise<void> => {
        if (!sessionService) return;
        const scene = sceneTreeStore.getState();
        const workbench = workbenchStore.getState();
        const documents = documentStore.getState();
        await sessionService.save({
            sceneTree: {
                openedNodeIds: scene.openedNodeIds,
                activeNode: scene.activeNode,
                selectedIds: scene.selectedIds,
                expandedNodeIds: scene.expandedNodeIds,
            },
            workbench: {
                activeWidgetId: workbench.activeWidgetId,
                openWidgetIds: Object.keys(workbench.widgetAreaById),
                panelSizes: workbench.panelSizes,
            },
            documents: {
                activeUri: documents.activeUri,
                opened: documents.order
                    .map((uri) => documents.byUri[uri])
                    .filter((doc): doc is DocumentRecord => doc !== undefined),
            },
        });
    };

    /** Register a widget contribution and open it in its default area. */
    const registerWidget = (widget: WidgetContribution) => {
        widgets.set(widget.id, widget);
        dispatchWorkbenchIntent({
            type: REGISTER_WIDGET,
            payload: {
                id: widget.id,
                title: widget.title,
                defaultArea: widget.defaultArea,
                closable: widget.closable,
            },
        });
    };

    const unregisterWidget = (id: string) => {
        widgets.delete(id);
        dispatchWorkbenchIntent({ type: CLOSE_WIDGET, payload: { id } });
    };

    const openProject = async (path: string): Promise<void> => {
        setProjectPath(path);
        if (path && projectPort) {
            await loadProjectByPath(path);
        }
    };

    const closeProject = (): void => {
        projectStore.dispatch({ type: CLEAR_PROJECT });
        contextKeyService.set('projectOpen', false);
    };

    const createProject = async (name: string, filePath: string): Promise<void> => {
        if (!projectPort) throw new Error('Project port not available');
        projectStore.dispatch({ type: SET_LOADING, payload: true });
        try {
            await projectPort.createProject(name, filePath);
            setProjectPath(filePath);
            await loadProjectByPath(filePath);
        } catch (e) {
            projectStore.dispatch({
                type: SET_ERROR,
                payload: e instanceof Error ? e : new Error(String(e)),
            });
            throw e;
        }
    };

    const addAssetToProject = async (
        asset: Omit<IInputAsset, 'id' | 'importedAt'>
    ): Promise<void> => {
        const path = projectStore.getState().projectFilePath;
        if (!path || !projectPort) throw new Error('No project open or project port not available');
        const updated = await projectPort.addInputAsset(path, asset);
        projectStore.dispatch({ type: SET_PROJECT, payload: updated });
    };

    const convertAsset = async (
        input: AssetConversionInput
    ): Promise<AssetConversionViewModel['lastResult']> => {
        if (!assetConversionPort) throw new Error('Asset conversion port not available');
        assetConversionStore.dispatch({ type: START_CONVERSION });
        try {
            const result = await assetConversionPort.convertToZko(input);
            assetConversionStore.dispatch({ type: SET_CONVERSION_RESULT, payload: result });
            const path = projectStore.getState().projectFilePath;
            if (path && projectPort && result) {
                try {
                    const updated = await projectPort.addInputAsset(path, {
                        path: input.path,
                        fileName: input.fileName,
                        format: input.format,
                    });
                    projectStore.dispatch({ type: SET_PROJECT, payload: updated });
                } catch (e) {
                    const detail = e instanceof Error ? e.message : String(e);
                    assetConversionStore.dispatch({
                        type: SET_PROJECT_PERSIST_WARNING,
                        payload: `Could not save asset to project: ${detail}`,
                    });
                }
            }
            return result;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error occurred';
            assetConversionStore.dispatch({ type: SET_CONVERSION_ERROR, payload: message });
            throw e;
        }
    };

    const startEngine = async (): Promise<void> => {
        if (!engineSessionPort) return;
        engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_STATUS, payload: 'starting' });
        try {
            await engineSessionPort.startEngineSession({
                projectPath: getWorkspace() ?? undefined,
            });
            engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_STATUS, payload: 'running' });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_ERROR, payload: message });
            throw e;
        }
    };

    const stopEngine = async (): Promise<void> => {
        if (!engineSessionPort) return;
        engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_STATUS, payload: 'stopping' });
        try {
            await engineSessionPort.stopEngineSession();
            engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_STATUS, payload: 'idle' });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_ERROR, payload: message });
            throw e;
        }
    };

    const restartEngine = async (): Promise<void> => {
        if (!engineSessionPort) return;
        engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_STATUS, payload: 'stopping' });
        try {
            await engineSessionPort.restartEngineSession();
            engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_STATUS, payload: 'running' });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            engineSessionStore.dispatch({ type: ENGINE_SESSION_SET_ERROR, payload: message });
            throw e;
        }
    };

    return {
        executeCommand: (id: string, payload?: unknown): RuntimeEffect[] => {
            const effects = commandService.execute(id, payload);
            scheduleSessionSave();
            return effects;
        },
        registerCommand: (id: string, handler: CommandHandler) =>
            commandService.register(id, handler),
        unregisterCommand: (id: string) => commandService.unregister(id),
        hasCommand: (id: string) => commandService.has(id),
        contextKey: {
            set: (key: string, value: unknown) => contextKeyService.set(key, value),
            get: (key: string) => contextKeyService.get(key),
            getBool: (key: string) => contextKeyService.getBool(key),
            evaluate: (expr: string) => contextKeyService.evaluate(expr),
        },
        getSceneTreeState: () => sceneTreeStore.getState(),
        getSceneTreeViewModel: () => getSceneTreeViewModel(sceneTreeStore.getState()),
        subscribeSceneTree: (listener: () => void) => sceneTreeStore.subscribe(listener),
        dispatchSceneTree: dispatchSceneTreeIntent,
        setTreeFromRoot: (root: ZObjectLike | undefined) => {
            if (root) {
                const tree: TreeNode[] = [convertZObjectToTreeNode(root)];
                dispatchSceneTreeIntent({ type: SET_TREE, payload: { tree } });
                if (tree.length > 0) {
                    void hydrateSession();
                }
            } else {
                dispatchSceneTreeIntent({ type: SET_TREE, payload: { tree: [] } });
            }
        },
        getWorkbenchViewModel: () => getWorkbenchViewModel(workbenchStore.getState()),
        subscribeWorkbench: (listener: () => void) => workbenchStore.subscribe(listener),
        dispatchWorkbench: dispatchWorkbenchIntent,
        registerWidget,
        unregisterWidget,
        openWidget: (id: string, area?: WorkbenchArea) =>
            dispatchWorkbenchIntent({ type: OPEN_WIDGET, payload: { id, area } }),
        closeWidget: (id: string) =>
            dispatchWorkbenchIntent({ type: CLOSE_WIDGET, payload: { id } }),
        activateWidget: (id: string) =>
            dispatchWorkbenchIntent({ type: ACTIVATE_WIDGET, payload: { id } }),
        getDocumentState: () => documentStore.getState(),
        getDocumentViewModel: () => getDocumentViewModel(documentStore.getState()),
        subscribeDocuments: (listener: () => void) => documentStore.subscribe(listener),
        dispatchDocuments: dispatchDocumentIntent,
        sessionSave: async (): Promise<void> => {
            await saveSessionSnapshot();
        },
        sessionRestore: async (): Promise<SessionData | null> => {
            if (!sessionService) return null;
            const data = await sessionService.restore();
            if (data) {
                applySession(data);
            }
            sessionHydrated = true;
            return data;
        },
        hydrateSession,
        setWorkspace,
        getWorkspace,
        setProjectPath,
        getProjectPath,
        getProjectViewModel: () => getProjectViewModel(projectStore.getState()),
        subscribeProject: (listener: () => void) => projectStore.subscribe(listener),
        openProject,
        closeProject,
        createProject,
        addAssetToProject,
        getAssetConversionViewModel: () =>
            getAssetConversionViewModel(assetConversionStore.getState()),
        subscribeAssetConversion: (listener: () => void) =>
            assetConversionStore.subscribe(listener),
        setProjectPersistWarning: (message: string | null) => {
            assetConversionStore.dispatch({
                type: SET_PROJECT_PERSIST_WARNING,
                payload: message,
            });
        },
        convertAsset,
        getEngineSessionViewModel: () =>
            getEngineSessionViewModel(engineSessionStore.getState()),
        subscribeEngineSession: (listener: () => void) =>
            engineSessionStore.subscribe(listener),
        startEngine,
        stopEngine,
        restartEngine,
    };
}
