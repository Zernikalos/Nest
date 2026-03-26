import {
    ACTIVATE_WIDGET,
    CLOSE_WIDGET,
    OPEN_WIDGET,
    REGISTER_WIDGET,
    createWorkbenchStore,
    getWorkbenchViewModel,
} from './WorkbenchModule.js';

describe('WorkbenchModule', () => {
    it('registers and opens widgets in areas', () => {
        const store = createWorkbenchStore();
        store.dispatch({
            type: REGISTER_WIDGET,
            payload: {
                id: 'scene.tree',
                title: 'Scene Tree',
                defaultArea: 'left',
                closable: false,
            },
        });
        store.dispatch({ type: OPEN_WIDGET, payload: { id: 'scene.tree' } });
        const vm = getWorkbenchViewModel(store.getState());
        expect(vm.areas.left).toHaveLength(1);
        expect(vm.activeWidgetId).toBe('scene.tree');
    });

    it('activates and closes widgets', () => {
        const store = createWorkbenchStore();
        store.dispatch({
            type: REGISTER_WIDGET,
            payload: {
                id: 'scene.tree',
                title: 'Scene Tree',
                defaultArea: 'left',
                closable: false,
            },
        });
        store.dispatch({
            type: REGISTER_WIDGET,
            payload: {
                id: 'inspector',
                title: 'Inspector',
                defaultArea: 'right',
                closable: true,
            },
        });
        store.dispatch({ type: OPEN_WIDGET, payload: { id: 'scene.tree' } });
        store.dispatch({ type: OPEN_WIDGET, payload: { id: 'inspector' } });
        store.dispatch({ type: ACTIVATE_WIDGET, payload: { id: 'scene.tree' } });
        let vm = getWorkbenchViewModel(store.getState());
        expect(vm.activeWidgetId).toBe('scene.tree');
        store.dispatch({ type: CLOSE_WIDGET, payload: { id: 'scene.tree' } });
        vm = getWorkbenchViewModel(store.getState());
        expect(vm.areas.left).toHaveLength(0);
    });
});
