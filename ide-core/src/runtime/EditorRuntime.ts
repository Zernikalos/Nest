import type {
    AssetConversionInput,
    IInputAsset,
    TreeNode,
    ZObjectLike,
    WorkbenchArea,
} from '../domain/types.js';
import type {
    AssetConversionPort,
    EngineSessionPort,
    ProjectPort,
    StoragePort,
} from '../ports/index.js';
import type { SessionData } from '../services/SessionService.js';
import type { CommandHandler } from '../services/CommandService.js';
import { createSceneTreeStore, getSceneTreeViewModel, SET_TREE } from '../domain/SceneTreeModule.js';
import type { SceneTreeState, SceneTreeViewModel } from '../domain/SceneTreeModule.js';
import { createWorkbenchStore, getWorkbenchViewModel } from '../domain/WorkbenchModule.js';
import type { WorkbenchViewModel } from '../domain/WorkbenchModule.js';
import { createDocumentStore, getDocumentViewModel } from '../domain/DocumentModule.js';
import type { DocumentState, DocumentViewModel } from '../domain/DocumentModule.js';
import { createProjectStore, getProjectViewModel, SET_PROJECT } from '../domain/ProjectModule.js';
import type { ProjectViewModel } from '../domain/ProjectModule.js';
import {
    createAssetConversionStore,
    getAssetConversionViewModel,
    START_CONVERSION,
    SET_CONVERSION_RESULT,
    SET_CONVERSION_ERROR,
    SET_PROJECT_PERSIST_WARNING,
} from '../domain/AssetConversionModule.js';
import type { AssetConversionViewModel } from '../domain/AssetConversionModule.js';
import {
    createEngineSessionStore,
    getEngineSessionViewModel,
} from '../domain/EngineSessionModule.js';
import type { EngineSessionViewModel } from '../domain/EngineSessionModule.js';
import { convertZObjectToTreeNode } from '../domain/sceneTreeUtils.js';
import { SessionService } from '../services/SessionService.js';
import { CommandService } from '../services/CommandService.js';
import { ContextKeyService } from '../services/ContextKeyService.js';
import type { RuntimeEffect, WidgetContribution } from '../contracts/index.js';
import type { SceneTreeIntent, DocumentIntent, WorkbenchIntent } from '../contracts/intents.js';
import { ACTIVATE_WIDGET, CLOSE_WIDGET } from '../domain/WorkbenchModule.js';
import { SESSION_PERSIST } from '../contracts/effects.js';
import { EffectCaller } from './EffectCaller.js';
import { StoreDispatcher } from './StoreDispatcher.js';
import { SceneDocumentCoordinator } from './SceneDocumentCoordinator.js';
import { SessionCoordinator } from './SessionCoordinator.js';
import { WidgetLifecycleManager } from './WidgetLifecycleManager.js';
import { ProjectCoordinator } from './ProjectCoordinator.js';
import { EngineCoordinator } from './EngineCoordinator.js';

export interface EditorRuntimePorts {
    storage?: StoragePort;
    project?: ProjectPort;
    assetConversion?: AssetConversionPort;
    engineSession?: EngineSessionPort;
}

export interface EditorRuntime {
    readonly scene: {
        getState(): SceneTreeState;
        getViewModel(): SceneTreeViewModel;
        subscribe(listener: () => void): () => void;
        dispatch(intent: SceneTreeIntent): RuntimeEffect[];
        setTreeFromRoot(root: ZObjectLike | undefined): void;
    };
    readonly documents: {
        getState(): DocumentState;
        getViewModel(): DocumentViewModel;
        subscribe(listener: () => void): () => void;
        dispatch(intent: DocumentIntent): RuntimeEffect[];
        openZObject(nodeId: string, title?: string): RuntimeEffect[];
        close(uri: string): RuntimeEffect[];
        setActive(uri: string | null): RuntimeEffect[];
    };
    readonly workbench: {
        getViewModel(): WorkbenchViewModel;
        subscribe(listener: () => void): () => void;
        dispatch(intent: WorkbenchIntent): RuntimeEffect[];
        registerWidget(widget: WidgetContribution): void;
        unregisterWidget(id: string): void;
        openWidget(id: string, area?: WorkbenchArea): RuntimeEffect[];
        closeWidget(id: string): RuntimeEffect[];
        activateWidget(id: string): RuntimeEffect[];
    };
    readonly project: {
        getViewModel(): ProjectViewModel;
        subscribe(listener: () => void): () => void;
        setPath(path: string | null): void;
        getPath(): string | null;
        open(path: string): Promise<void>;
        close(): void;
        create(name: string, filePath: string): Promise<void>;
        addAsset(asset: Omit<IInputAsset, 'id' | 'importedAt'>): Promise<void>;
    };
    readonly commands: {
        execute(id: string, payload?: unknown): RuntimeEffect[];
        register(id: string, handler: CommandHandler): void;
        unregister(id: string): void;
        has(id: string): boolean;
    };
    readonly context: {
        set(key: string, value: unknown): void;
        get(key: string): unknown;
        getBool(key: string): boolean;
        evaluate(expr: string): boolean;
    };
    readonly session: {
        save(): Promise<void>;
        restore(): Promise<SessionData | null>;
        hydrate(): Promise<void>;
    };
    readonly assetConversion: {
        getViewModel(): AssetConversionViewModel;
        subscribe(listener: () => void): () => void;
        setProjectPersistWarning(message: string | null): void;
        convert(input: AssetConversionInput): Promise<AssetConversionViewModel['lastResult']>;
    };
    readonly engine: {
        getViewModel(): EngineSessionViewModel;
        subscribe(listener: () => void): () => void;
        start(): Promise<void>;
        stop(): Promise<void>;
        restart(): Promise<void>;
    };
}

export class EditorRuntimeImpl implements EditorRuntime {
    private readonly sceneTreeStore = createSceneTreeStore();
    private readonly workbenchStore = createWorkbenchStore();
    private readonly documentStore = createDocumentStore();
    private readonly projectStore = createProjectStore();
    private readonly assetConversionStore = createAssetConversionStore();
    private readonly engineSessionStore = createEngineSessionStore();
    private readonly commandService = new CommandService();
    private readonly contextKeyService = new ContextKeyService();
    private readonly sessionService: SessionService | null;
    private readonly assetConversionPort: AssetConversionPort | null;
    private readonly effectCaller = new EffectCaller();
    private readonly dispatcher: StoreDispatcher;
    private readonly sceneDocuments: SceneDocumentCoordinator;
    private readonly sessionCoordinator: SessionCoordinator;
    private readonly widgets: WidgetLifecycleManager;
    private readonly projects: ProjectCoordinator;
    private readonly engines: EngineCoordinator;

    readonly scene: EditorRuntime['scene'];
    readonly documents: EditorRuntime['documents'];
    readonly workbench: EditorRuntime['workbench'];
    readonly project: EditorRuntime['project'];
    readonly commands: EditorRuntime['commands'];
    readonly context: EditorRuntime['context'];
    readonly session: EditorRuntime['session'];
    readonly assetConversion: EditorRuntime['assetConversion'];
    readonly engine: EditorRuntime['engine'];

    constructor(ports?: EditorRuntimePorts) {
        this.sessionService = ports?.storage ? new SessionService(ports.storage) : null;
        this.assetConversionPort = ports?.assetConversion ?? null;

        this.dispatcher = new StoreDispatcher(this.effectCaller);

        this.sceneDocuments = new SceneDocumentCoordinator(
            this.sceneTreeStore,
            this.documentStore,
            this.dispatcher
        );

        this.sessionCoordinator = new SessionCoordinator(
            this.sessionService,
            this.sceneTreeStore,
            this.workbenchStore,
            this.documentStore,
            this.dispatcher,
            this.sceneDocuments
        );

        this.effectCaller.register(SESSION_PERSIST, () => {
            this.sessionCoordinator.scheduleSave();
        });

        this.widgets = new WidgetLifecycleManager(this.workbenchStore, this.dispatcher);
        this.projects = new ProjectCoordinator(
            this.projectStore,
            ports?.project ?? null,
            this.contextKeyService,
            this.dispatcher
        );
        this.engines = new EngineCoordinator(
            this.engineSessionStore,
            ports?.engineSession ?? null,
            this.dispatcher,
            () => this.projects.getProjectPath()
        );

        this.scene = {
            getState: () => this.sceneTreeStore.getState(),
            getViewModel: () =>
                getSceneTreeViewModel(
                    this.sceneTreeStore.getState(),
                    this.documentStore.getState()
                ),
            subscribe: (listener) => this.sceneTreeStore.subscribe(listener),
            dispatch: (intent) => this.sceneDocuments.dispatchScene(intent),
            setTreeFromRoot: (root) => this.setTreeFromRoot(root),
        };

        this.documents = {
            getState: () => this.documentStore.getState(),
            getViewModel: () => getDocumentViewModel(this.documentStore.getState()),
            subscribe: (listener) => this.documentStore.subscribe(listener),
            dispatch: (intent) => this.sceneDocuments.dispatchDocument(intent),
            openZObject: (nodeId, title) => this.sceneDocuments.openZObject(nodeId, title),
            close: (uri) => this.sceneDocuments.close(uri),
            setActive: (uri) => this.sceneDocuments.setActive(uri),
        };

        this.workbench = {
            getViewModel: () => getWorkbenchViewModel(this.workbenchStore.getState()),
            subscribe: (listener) => this.workbenchStore.subscribe(listener),
            dispatch: (intent) => this.widgets.dispatch(intent),
            registerWidget: (widget) => {
                this.widgets.register(widget);
            },
            unregisterWidget: (id) => {
                this.widgets.unregister(id);
            },
            openWidget: (id, area) => this.widgets.open(id, area),
            closeWidget: (id) =>
                this.widgets.dispatch({ type: CLOSE_WIDGET, payload: { id } }),
            activateWidget: (id) =>
                this.widgets.dispatch({ type: ACTIVATE_WIDGET, payload: { id } }),
        };

        this.project = {
            getViewModel: () => getProjectViewModel(this.projectStore.getState()),
            subscribe: (listener) => this.projectStore.subscribe(listener),
            setPath: (path) => this.projects.setProjectPath(path),
            getPath: () => this.projects.getProjectPath(),
            open: (path) => this.projects.openProject(path),
            close: () => this.projects.closeProject(),
            create: (name, filePath) => this.projects.createProject(name, filePath),
            addAsset: (asset) => this.projects.addAssetToProject(asset),
        };

        this.commands = {
            execute: (id, payload) => {
                const effects = this.commandService.execute(id, payload);
                this.sessionCoordinator.scheduleSave();
                return effects;
            },
            register: (id, handler) => this.commandService.register(id, handler),
            unregister: (id) => this.commandService.unregister(id),
            has: (id) => this.commandService.has(id),
        };

        this.context = {
            set: (key, value) => this.contextKeyService.set(key, value),
            get: (key) => this.contextKeyService.get(key),
            getBool: (key) => this.contextKeyService.getBool(key),
            evaluate: (expr) => this.contextKeyService.evaluate(expr),
        };

        this.session = {
            save: () => this.sessionCoordinator.saveSnapshot(),
            restore: () => this.sessionCoordinator.restore(),
            hydrate: () => this.sessionCoordinator.hydrate(),
        };

        this.assetConversion = {
            getViewModel: () =>
                getAssetConversionViewModel(this.assetConversionStore.getState()),
            subscribe: (listener) => this.assetConversionStore.subscribe(listener),
            setProjectPersistWarning: (message) => {
                this.dispatcher.dispatch(this.assetConversionStore, {
                    type: SET_PROJECT_PERSIST_WARNING,
                    payload: message,
                });
            },
            convert: (input) => this.convertAsset(input, ports?.project ?? null),
        };

        this.engine = {
            getViewModel: () =>
                getEngineSessionViewModel(this.engineSessionStore.getState()),
            subscribe: (listener) => this.engineSessionStore.subscribe(listener),
            start: () => this.engines.start(),
            stop: () => this.engines.stop(),
            restart: () => this.engines.restart(),
        };
    }

    private setTreeFromRoot(root: ZObjectLike | undefined): void {
        if (root) {
            const tree: TreeNode[] = [convertZObjectToTreeNode(root)];
            this.scene.dispatch({ type: SET_TREE, payload: { tree } });
            if (tree.length > 0) {
                void this.session.hydrate();
            }
        } else {
            this.scene.dispatch({ type: SET_TREE, payload: { tree: [] } });
        }
    }

    private async convertAsset(
        input: AssetConversionInput,
        projectPort: ProjectPort | null
    ): Promise<AssetConversionViewModel['lastResult']> {
        if (!this.assetConversionPort) {
            throw new Error('Asset conversion port not available');
        }
        this.dispatcher.dispatch(this.assetConversionStore, { type: START_CONVERSION });
        try {
            const result = await this.assetConversionPort.convertToZko(input);
            this.dispatcher.dispatch(this.assetConversionStore, {
                type: SET_CONVERSION_RESULT,
                payload: result,
            });
            const path = this.projects.getProjectPath();
            if (path && projectPort && result) {
                try {
                    const updated = await projectPort.addInputAsset(path, {
                        path: input.path,
                        fileName: input.fileName,
                        format: input.format,
                    });
                    this.dispatcher.dispatch(this.projectStore, {
                        type: SET_PROJECT,
                        payload: updated,
                    });
                } catch (e) {
                    const detail = e instanceof Error ? e.message : String(e);
                    this.dispatcher.dispatch(this.assetConversionStore, {
                        type: SET_PROJECT_PERSIST_WARNING,
                        payload: `Could not save asset to project: ${detail}`,
                    });
                }
            }
            return result;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error occurred';
            this.dispatcher.dispatch(this.assetConversionStore, {
                type: SET_CONVERSION_ERROR,
                payload: message,
            });
            throw e;
        }
    }
}
