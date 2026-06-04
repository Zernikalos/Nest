import type { SceneTreeViewModel } from '../editor/sceneTree.js';
import type { DocumentViewModel } from '../editor/documents.js';
import type { WorkbenchViewModel } from '../editor/workbench.js';
import type { ProjectViewModel } from '../editor/project.js';
import type { EngineSessionViewModel } from '../editor/engine.js';
import type { AssetConversionViewModel } from '../editor/assetConversion.js';

/** Aggregated read model for UI adapters. Use getSlice / subscribeSlice or getSnapshot / onChange. */
export interface EditorSnapshot {
    scene: SceneTreeViewModel;
    documents: DocumentViewModel;
    workbench: WorkbenchViewModel;
    project: ProjectViewModel;
    engine: EngineSessionViewModel;
    assets: AssetConversionViewModel;
}
