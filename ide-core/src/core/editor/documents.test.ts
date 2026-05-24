import { getDocumentViewModel } from './documents.js';
import { createSceneDocumentsEditors } from '../runtime/createSceneDocumentsEditors.js';

describe('DocumentsEditor', () => {
    it('opens and activates a document', () => {
        const { documents: editor } = createSceneDocumentsEditors(() => {});
        editor.open('zobject://1', 'One');
        const vm = getDocumentViewModel(editor.getState());
        expect(vm.activeUri).toBe('zobject://1');
        expect(vm.openedDocuments).toHaveLength(1);
    });

    it('closes a document and updates active', () => {
        const { documents: editor } = createSceneDocumentsEditors(() => {});
        editor.open('zobject://1');
        editor.open('zobject://2');
        editor.close('zobject://2');
        const vm = getDocumentViewModel(editor.getState());
        expect(vm.activeUri).toBe('zobject://1');
        expect(vm.openedDocuments).toHaveLength(1);
    });

    it('marks document dirty', () => {
        const { documents: editor } = createSceneDocumentsEditors(() => {});
        editor.open('zobject://1');
        editor.setDirty('zobject://1', true);
        expect(editor.getState().byUri['zobject://1'].dirty).toBe(true);
    });
});
