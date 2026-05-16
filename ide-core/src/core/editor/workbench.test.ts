import { WorkbenchEditor, getWorkbenchViewModel } from './workbench.js';

function stubController() {
    return {
        serializeState: () => ({}),
        restoreState: () => {},
        getViewModel: () => ({}),
        onDeactivate: () => {},
        onDispose: () => {},
    };
}

describe('WorkbenchEditor', () => {
    it('registers and opens widgets in areas', () => {
        const editor = new WorkbenchEditor(() => {});
        editor.register({
            id: 'test-widget',
            title: 'Test',
            defaultArea: 'left',
            closable: true,
            createController: () => stubController(),
        });
        editor.open('test-widget', 'left');
        const vm = getWorkbenchViewModel(editor.getState());
        expect(vm.areas.left).toHaveLength(1);
        expect(vm.areas.left[0].id).toBe('test-widget');
        expect(vm.activeWidgetId).toBe('test-widget');
    });

    it('closes widget and updates active', () => {
        const editor = new WorkbenchEditor(() => {});
        editor.register({
            id: 'w1',
            title: 'W1',
            defaultArea: 'left',
            closable: true,
            createController: () => stubController(),
        });
        editor.register({
            id: 'w2',
            title: 'W2',
            defaultArea: 'left',
            closable: true,
            createController: () => stubController(),
        });
        editor.open('w1');
        editor.open('w2');
        editor.unregister('w2');
        const vm = getWorkbenchViewModel(editor.getState());
        expect(vm.activeWidgetId).toBe('w1');
        expect(vm.areas.left.map((w) => w.id)).toEqual(['w1']);
    });
});
