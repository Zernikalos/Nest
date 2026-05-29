import { DocumentsEditor } from '../editor/documents.js';
import { SceneTreeEditor } from '../editor/sceneTree.js';
import type { DomainCommitHandler } from '../editor/DomainEditorBase.js';
import { EditorOrchestrator } from './EditorOrchestrator.js';

/** Scene + documents editors with orchestrator wired at construction (circular deps via getter). */
export function createSceneDocumentsEditors(onCommit: DomainCommitHandler): {
    scene: SceneTreeEditor;
    documents: DocumentsEditor;
} {
    let orchestrator!: EditorOrchestrator;
    const scene = new SceneTreeEditor(onCommit, () => orchestrator);
    const documents = new DocumentsEditor(onCommit, () => orchestrator);
    orchestrator = new EditorOrchestrator(scene, documents);
    return { scene, documents };
}
