import type { WritableDraft } from 'immer';
import { createStore } from 'zustand/vanilla';
import { immer } from 'zustand/middleware/immer';

export type DomainCommitHandler = () => void;

type ImmerSetState<S> = (recipe: (draft: WritableDraft<S>) => void) => void;

interface ImmerDomainStore<S> {
    getState: () => S;
    setState: ImmerSetState<S>;
    subscribe: (listener: () => void) => () => void;
}

/**
 * Shared state container for domain editors: Zustand vanilla + Immer drafts.
 * Public API remains on concrete *Editor subclasses.
 */
export abstract class DomainEditorBase<S> {
    protected readonly zustandStore: ImmerDomainStore<S>;

    constructor(initialState: S, private readonly onCommit: DomainCommitHandler) {
        this.zustandStore = createStore<S>()(immer(() => initialState)) as ImmerDomainStore<S>;
    }

    getState(): S {
        return this.zustandStore.getState();
    }

    subscribe(listener: () => void): () => void {
        return this.zustandStore.subscribe(listener);
    }

    protected patch(recipe: (draft: WritableDraft<S>) => void): void {
        this.zustandStore.setState(recipe);
        this.onCommit();
    }

    protected patchSilent(recipe: (draft: WritableDraft<S>) => void): void {
        this.zustandStore.setState(recipe);
    }
}
