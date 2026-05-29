import { WorkbenchArea } from '../domain/enums.js';
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
            defaultArea: WorkbenchArea.Left,
            closable: true,
            createController: () => stubController(),
        });
        editor.open('test-widget', WorkbenchArea.Left);
        const vm = getWorkbenchViewModel(editor.getState());
        expect(vm.areas[WorkbenchArea.Left]).toHaveLength(1);
        expect(vm.areas[WorkbenchArea.Left][0].id).toBe('test-widget');
        expect(vm.activeWidgetId).toBe('test-widget');
    });

    it('closes widget and updates active', () => {
        const editor = new WorkbenchEditor(() => {});
        editor.register({
            id: 'w1',
            title: 'W1',
            defaultArea: WorkbenchArea.Left,
            closable: true,
            createController: () => stubController(),
        });
        editor.register({
            id: 'w2',
            title: 'W2',
            defaultArea: WorkbenchArea.Left,
            closable: true,
            createController: () => stubController(),
        });
        editor.open('w1');
        editor.open('w2');
        editor.unregister('w2');
        const vm = getWorkbenchViewModel(editor.getState());
        expect(vm.activeWidgetId).toBe('w1');
        expect(vm.areas[WorkbenchArea.Left].map((w) => w.id)).toEqual(['w1']);
    });
});
