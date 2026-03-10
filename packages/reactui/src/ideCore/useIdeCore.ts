import { useContext, useState, useEffect, useCallback } from 'react';
import { IdeCoreContext } from './IdeCoreContext';
import {
    SELECT_NODES,
    OPEN_TAB,
    CLOSE_TAB,
    SET_PANEL_SIZES,
} from '@zstudio/ide-core';

export function useIdeCore() {
    const runtime = useContext(IdeCoreContext);
    if (!runtime) {
        throw new Error('useIdeCore must be used within IdeCoreProvider');
    }

    const [viewModel, setViewModel] = useState(() => runtime.getSceneTreeViewModel());
    const [workbenchViewModel, setWorkbenchViewModel] = useState(() =>
        runtime.getWorkbenchViewModel()
    );

    useEffect(() => {
        return runtime.subscribeSceneTree(() => {
            setViewModel(runtime.getSceneTreeViewModel());
        });
    }, [runtime]);

    useEffect(() => {
        return runtime.subscribeWorkbench(() => {
            setWorkbenchViewModel(runtime.getWorkbenchViewModel());
        });
    }, [runtime]);

    const dispatch = useCallback(
        (type: string, payload?: unknown) => {
            runtime.dispatchSceneTree({ type, payload });
        },
        [runtime]
    );

    const handleSelect = useCallback(
        (ids: string[]) => {
            dispatch(SELECT_NODES, ids);
            const lastId = ids[ids.length - 1];
            if (lastId) {
                dispatch(OPEN_TAB, lastId);
            }
        },
        [dispatch]
    );

    const handleTabChange = useCallback(
        (nodeId: string) => {
            dispatch(OPEN_TAB, nodeId);
        },
        [dispatch]
    );

    const handleTabClose = useCallback(
        (nodeId: string) => {
            dispatch(CLOSE_TAB, nodeId);
        },
        [dispatch]
    );

    const onLayoutChange = useCallback(
        (groupId: string, sizes: number[]) => {
            runtime.dispatchWorkbench({ type: SET_PANEL_SIZES, payload: { groupId, sizes } });
        },
        [runtime]
    );

    return {
        viewModel,
        workbenchViewModel,
        handleSelect,
        handleTabChange,
        handleTabClose,
        onLayoutChange,
        setTreeFromRoot: runtime.setTreeFromRoot,
        sessionSave: runtime.sessionSave,
        sessionRestore: runtime.sessionRestore,
        dispatchSceneTree: runtime.dispatchSceneTree,
        getSceneTreeState: () => runtime.getSceneTreeState(),
        executeCommand: runtime.executeCommand,
        registerCommand: runtime.registerCommand,
        contextKey: runtime.contextKey,
    };
}
