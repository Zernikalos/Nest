import type {
    AssetConversionPort,
    EngineSessionPort,
    ProjectPort,
    StoragePort,
} from '../ports/index.js';
import type { SessionData } from '../services/SessionService.js';
import { SessionService } from '../services/SessionService.js';
import { CommandService } from '../services/CommandService.js';
import { ContextKeyService } from '../services/ContextKeyService.js';
import type { WidgetController } from '../contracts/index.js';
import type { EditorSnapshot } from '../contracts/snapshot.js';
import { SceneTreeEditor, getSceneTreeViewModel } from '../editor/sceneTree.js';
import { DocumentsEditor, getDocumentViewModel } from '../editor/documents.js';
import { WorkbenchEditor, getWorkbenchViewModel } from '../editor/workbench.js';
import { ProjectEditor, getProjectViewModel } from '../editor/project.js';
import { EngineEditor, getEngineSessionViewModel } from '../editor/engine.js';
import { AssetConversionEditor } from '../editor/assetConversion.js';
import { SessionCoordinator } from './SessionCoordinator.js';
import { EditorChangeNotifier } from './EditorChangeNotifier.js';
import { createSceneDocumentsEditors } from './createSceneDocumentsEditors.js';

export interface EditorRuntimePorts {
    storage?: StoragePort;
    project?: ProjectPort;
    assetConversion?: AssetConversionPort;
    engineSession?: EngineSessionPort;
}

/** Framework-agnostic editor runtime: domain editors own logic; UI reads snapshots. */
export type EditorSnapshotKey = keyof EditorSnapshot;

type SliceSubscriber = (listener: () => void) => () => void;

export interface EditorRuntime {
    getSnapshot(): EditorSnapshot;
    getSlice<K extends EditorSnapshotKey>(key: K): EditorSnapshot[K];
    onChange(listener: () => void): () => void;
    /** Alias for onChange — intended for external store adapters. */
    subscribe(listener: () => void): () => void;
    subscribeSlice<K extends EditorSnapshotKey>(
        key: K,
        listener: () => void
    ): () => void;
    getWidgetController(id: string): WidgetController | undefined;

    readonly scene: SceneTreeEditor;
    readonly documents: DocumentsEditor;
    readonly workbench: WorkbenchEditor;
    readonly project: ProjectEditor;
    readonly engine: EngineEditor;
    readonly assetConversion: AssetConversionEditor;

    readonly commands: CommandService;
    readonly context: ContextKeyService;
    readonly session: {
        save(): Promise<void>;
        restore(): Promise<SessionData | null>;
        hydrate(): Promise<void>;
    };
}

export class EditorRuntimeImpl implements EditorRuntime {
    private readonly changeNotifier = new EditorChangeNotifier();
    private readonly sessionService: SessionService | null;
    private readonly sessionCoordinator: SessionCoordinator;
    private readonly sliceSubscribers: Record<EditorSnapshotKey, SliceSubscriber>;

    readonly scene: SceneTreeEditor;
    readonly documents: DocumentsEditor;
    readonly workbench: WorkbenchEditor;
    readonly project: ProjectEditor;
    readonly engine: EngineEditor;
    readonly assetConversion: AssetConversionEditor;

    readonly commands: CommandService;
    readonly context: ContextKeyService;
    readonly session: EditorRuntime['session'];

    constructor(ports?: EditorRuntimePorts) {
        this.sessionService = ports?.storage ? new SessionService(ports.storage) : null;
        this.context = new ContextKeyService();

        let sessionCoordinator!: SessionCoordinator;
        const onCommit = (): void => {
            this.changeNotifier.notify();
            sessionCoordinator.scheduleSave();
        };

        const linked = createSceneDocumentsEditors(onCommit);
        this.scene = linked.scene;
        this.documents = linked.documents;

        this.workbench = new WorkbenchEditor(onCommit);
        this.project = new ProjectEditor(
            onCommit,
            ports?.project ?? null,
            this.context
        );
        this.engine = new EngineEditor(
            onCommit,
            ports?.engineSession ?? null,
            () => this.project.getPath()
        );
        this.assetConversion = new AssetConversionEditor(
            onCommit,
            ports?.assetConversion ?? null,
            this.project
        );

        sessionCoordinator = new SessionCoordinator(
            this.sessionService,
            this.scene,
            this.workbench,
            this.documents,
            onCommit
        );
        this.sessionCoordinator = sessionCoordinator;

        this.commands = new CommandService(() => sessionCoordinator.scheduleSave());

        this.scene.setOnTreeSet(() => {
            void this.sessionCoordinator.hydrate();
        });

        this.session = {
            save: () => this.sessionCoordinator.saveSnapshot(),
            restore: () => this.sessionCoordinator.restore(),
            hydrate: () => this.sessionCoordinator.hydrate(),
        };

        this.sliceSubscribers = {
            scene: (listener) => {
                const unsubScene = this.scene.subscribe(listener);
                const unsubDocuments = this.documents.subscribe(listener);
                return () => {
                    unsubScene();
                    unsubDocuments();
                };
            },
            documents: (listener) => this.documents.subscribe(listener),
            workbench: (listener) => this.workbench.subscribe(listener),
            project: (listener) => this.project.subscribe(listener),
            engine: (listener) => this.engine.subscribe(listener),
            assets: (listener) => this.assetConversion.subscribe(listener),
        };
    }

    getSnapshot(): EditorSnapshot {
        const documentsState = this.documents.getState();
        return {
            scene: getSceneTreeViewModel(this.scene.getState(), documentsState),
            documents: getDocumentViewModel(documentsState),
            workbench: getWorkbenchViewModel(this.workbench.getState()),
            project: getProjectViewModel(this.project.getState()),
            engine: getEngineSessionViewModel(this.engine.getState()),
            assets: this.assetConversion.getState(),
        };
    }

    getSlice<K extends EditorSnapshotKey>(key: K): EditorSnapshot[K] {
        return this.getSnapshot()[key];
    }

    onChange(listener: () => void): () => void {
        return this.changeNotifier.onChange(listener);
    }

    subscribe(listener: () => void): () => void {
        return this.onChange(listener);
    }

    subscribeSlice<K extends EditorSnapshotKey>(key: K, listener: () => void): () => void {
        return this.sliceSubscribers[key](listener);
    }

    getWidgetController(id: string): WidgetController | undefined {
        return this.workbench.getController(id);
    }
}
