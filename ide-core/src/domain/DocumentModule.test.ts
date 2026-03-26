import {
    CLOSE_DOCUMENT,
    OPEN_DOCUMENT,
    SET_DOCUMENT_DIRTY,
    createDocumentStore,
    getDocumentViewModel,
} from './DocumentModule.js';

describe('DocumentModule', () => {
    it('opens and activates a document', () => {
        const store = createDocumentStore();
        store.dispatch({ type: OPEN_DOCUMENT, payload: { uri: 'zobject://1', title: 'One' } });
        const vm = getDocumentViewModel(store.getState());
        expect(vm.activeUri).toBe('zobject://1');
        expect(vm.openedDocuments).toHaveLength(1);
        expect(vm.openedDocuments[0].title).toBe('One');
    });

    it('marks document dirty and closes it', () => {
        const store = createDocumentStore();
        store.dispatch({ type: OPEN_DOCUMENT, payload: { uri: 'zobject://1' } });
        store.dispatch({
            type: SET_DOCUMENT_DIRTY,
            payload: { uri: 'zobject://1', dirty: true },
        });
        let vm = getDocumentViewModel(store.getState());
        expect(vm.openedDocuments[0].dirty).toBe(true);
        store.dispatch({ type: CLOSE_DOCUMENT, payload: { uri: 'zobject://1' } });
        vm = getDocumentViewModel(store.getState());
        expect(vm.openedDocuments).toHaveLength(0);
        expect(vm.activeUri).toBeNull();
    });
});
