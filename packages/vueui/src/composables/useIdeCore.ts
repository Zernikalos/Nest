import { inject, ref, onMounted, onUnmounted } from 'vue';
import type { EditorRuntime } from '@zstudio/ide-core';
import {
  SELECT_NODES,
  CLOSE_TAB,
  SET_ACTIVE_TAB,
  SET_PANEL_SIZES,
  CLOSE_DOCUMENT,
  SET_ACTIVE_DOCUMENT,
} from '@zstudio/ide-core';

export const RUNTIME_KEY = Symbol('ideRuntime') as symbol;

export function useIdeCore() {
  const runtime = inject<EditorRuntime>(RUNTIME_KEY);
  if (!runtime) {
    throw new Error('useIdeCore must be used within IdeCoreProvider');
  }

  const viewModel = ref(runtime.getSceneTreeViewModel());
  const workbenchViewModel = ref(runtime.getWorkbenchViewModel());
  const documentViewModel = ref(runtime.getDocumentViewModel());

  let unsubScene: (() => void) | null = null;
  let unsubWorkbench: (() => void) | null = null;
  let unsubDocuments: (() => void) | null = null;
  onMounted(() => {
    unsubScene = runtime.subscribeSceneTree(() => {
      viewModel.value = runtime.getSceneTreeViewModel();
    });
    unsubWorkbench = runtime.subscribeWorkbench(() => {
      workbenchViewModel.value = runtime.getWorkbenchViewModel();
    });
    unsubDocuments = runtime.subscribeDocuments(() => {
      documentViewModel.value = runtime.getDocumentViewModel();
    });
  });
  onUnmounted(() => {
    unsubScene?.();
    unsubWorkbench?.();
    unsubDocuments?.();
  });

  const handleSelect = (ids: string[]) => {
    runtime.dispatchSceneTree({ type: SELECT_NODES, payload: ids });
  };

  const handleTabChange = (nodeId: string) => {
    runtime.dispatchSceneTree({ type: SET_ACTIVE_TAB, payload: nodeId });
  };

  const handleTabClose = (nodeId: string) => {
    runtime.dispatchSceneTree({ type: CLOSE_TAB, payload: nodeId });
  };

  const handleCloseDocument = (uri: string) => {
    runtime.dispatchDocuments({ type: CLOSE_DOCUMENT, payload: { uri } });
  };

  const handleSetActiveDocument = (uri: string | null) => {
    runtime.dispatchDocuments({ type: SET_ACTIVE_DOCUMENT, payload: { uri } });
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
    documentViewModel,
    handleSelect,
    handleTabChange,
    handleTabClose,
    handleCloseDocument,
    handleSetActiveDocument,
    onLayoutChange,
    setTreeFromRoot: runtime.setTreeFromRoot,
    sessionSave: runtime.sessionSave,
    sessionRestore: runtime.sessionRestore,
    dispatchSceneTree: runtime.dispatchSceneTree,
    dispatchDocuments: runtime.dispatchDocuments,
    getSceneTreeState: runtime.getSceneTreeState,
    getDocumentViewModel: runtime.getDocumentViewModel,
    subscribeDocuments: runtime.subscribeDocuments,
    executeCommand: runtime.executeCommand,
    registerCommand: runtime.registerCommand,
    unregisterCommand: runtime.unregisterCommand,
    contextKey: runtime.contextKey,
    registerWidget: runtime.registerWidget,
    unregisterWidget: runtime.unregisterWidget,
    openWidget: runtime.openWidget,
    setWorkspace: runtime.setWorkspace,
    getWorkspace: runtime.getWorkspace,
  };
}
