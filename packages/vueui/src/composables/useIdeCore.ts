import { inject, ref, onMounted, onUnmounted } from 'vue';
import type { EditorRuntime } from '@zstudio/ide-core';
import {
  SELECT_NODES,
  OPEN_TAB,
  CLOSE_TAB,
  SET_PANEL_SIZES,
} from '@zstudio/ide-core';

export const RUNTIME_KEY = Symbol('ideRuntime') as symbol;

export function useIdeCore() {
  const runtime = inject<EditorRuntime>(RUNTIME_KEY);
  if (!runtime) {
    throw new Error('useIdeCore must be used within IdeCoreProvider');
  }

  const viewModel = ref(runtime.getSceneTreeViewModel());
  const workbenchViewModel = ref(runtime.getWorkbenchViewModel());

  let unsubScene: (() => void) | null = null;
  let unsubWorkbench: (() => void) | null = null;
  onMounted(() => {
    unsubScene = runtime.subscribeSceneTree(() => {
      viewModel.value = runtime.getSceneTreeViewModel();
    });
    unsubWorkbench = runtime.subscribeWorkbench(() => {
      workbenchViewModel.value = runtime.getWorkbenchViewModel();
    });
  });
  onUnmounted(() => {
    unsubScene?.();
    unsubWorkbench?.();
  });

  const handleSelect = (ids: string[]) => {
    runtime.dispatchSceneTree({ type: SELECT_NODES, payload: ids });
    const lastId = ids[ids.length - 1];
    if (lastId) {
      runtime.dispatchSceneTree({ type: OPEN_TAB, payload: lastId });
    }
  };

  const handleTabChange = (nodeId: string) => {
    runtime.dispatchSceneTree({ type: OPEN_TAB, payload: nodeId });
  };

  const handleTabClose = (nodeId: string) => {
    runtime.dispatchSceneTree({ type: CLOSE_TAB, payload: nodeId });
  };

  const onLayoutChange = (groupId: string, sizes: number[]) => {
    runtime.dispatchWorkbench({
      type: SET_PANEL_SIZES,
      payload: { groupId, sizes },
    });
  };

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
    getSceneTreeState: runtime.getSceneTreeState,
    executeCommand: runtime.executeCommand,
    registerCommand: runtime.registerCommand,
    contextKey: runtime.contextKey,
  };
}
