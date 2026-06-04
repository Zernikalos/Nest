import { DomainEditorBase } from './DomainEditorBase';

interface CounterState {
    count: number;
}

class CounterEditor extends DomainEditorBase<CounterState> {
    increment(): void {
        this.patch((d) => {
            d.count += 1;
        });
    }

    incrementSilent(): void {
        this.patchSilent((d) => {
            d.count += 1;
        });
    }
}

describe('DomainEditorBase', () => {
    it('starts with initial state', () => {
        const editor = new CounterEditor({ count: 0 }, () => {});
        expect(editor.getState().count).toBe(0);
    });

    it('patch updates state and calls onCommit', () => {
        const commits: number[] = [];
        const editor = new CounterEditor({ count: 0 }, () => commits.push(1));
        editor.increment();
        expect(editor.getState().count).toBe(1);
        expect(commits).toHaveLength(1);
    });

    it('patchSilent updates state without onCommit', () => {
        const commits: number[] = [];
        const editor = new CounterEditor({ count: 0 }, () => commits.push(1));
        editor.incrementSilent();
        expect(editor.getState().count).toBe(1);
        expect(commits).toHaveLength(0);
    });

    it('subscribe fires when state changes', () => {
        const editor = new CounterEditor({ count: 0 }, () => {});
        const calls: number[] = [];
        editor.subscribe(() => calls.push(editor.getState().count));
        editor.increment();
        expect(calls.length).toBeGreaterThan(0);
        expect(calls[calls.length - 1]).toBe(1);
    });
});
