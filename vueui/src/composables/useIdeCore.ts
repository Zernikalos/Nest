import { inject, ref, onMounted, onUnmounted } from 'vue';
import type { EditorRuntime } from '@ide-core';
import { SELECT_NODES, SET_PANEL_SIZES, nodeIdToDocumentUri } from '@ide-core';

export const RUNTIME_KEY = Symbol('ideRuntime') as symbol;

export function useIdeCore() {
  const runtime = inject<EditorRuntime>(RUNTIME_KEY);
  if (!runtime) {
    throw new Error('useIdeCore must be used within IdeCoreProvider');
  }

  const viewModel = ref(runtime.scene.getViewModel());
  const workbenchViewModel = ref(runtime.workbench.getViewModel());
  const documentViewModel = ref(runtime.documents.getViewModel());

  const refreshSceneViewModel = () => {
    viewModel.value = runtime.scene.getViewModel();
  };

  let unsubScene: (() => void) | null = null;
  let unsubWorkbench: (() => void) | null = null;
  let unsubDocuments: (() => void) | null = null;
  onMounted(() => {
    unsubScene = runtime.scene.subscribe(refreshSceneViewModel);
    unsubWorkbench = runtime.workbench.subscribe(() => {
      workbenchViewModel.value = runtime.workbench.getViewModel();
    });
    unsubDocuments = runtime.documents.subscribe(() => {
      documentViewModel.value = runtime.documents.getViewModel();
      refreshSceneViewModel();
    });
  });
  onUnmounted(() => {
    unsubScene?.();
    unsubWorkbench?.();
    unsubDocuments?.();
  });

  const handleSelect = (ids: string[]) => {
    runtime.scene.dispatch({ type: SELECT_NODES, payload: ids });
  };

  const handleTabChange = (nodeId: string) => {
    runtime.documents.openZObject(nodeId);
  };

  const handleTabClose = (nodeId: string) => {
    runtime.documents.close(nodeIdToDocumentUri(nodeId));
  };

  const handleCloseDocument = (uri: string) => {
    runtime.documents.close(uri);
  };

  const handleSetActiveDocument = (uri: string | null) => {
    runtime.documents.setActive(uri);
  };

  const onLayoutChange = (groupId: string, sizes: number[]) => {
    runtime.workbench.dispatch({
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
    setTreeFromRoot: runtime.scene.setTreeFromRoot,
    sessionSave: runtime.session.save,
    sessionRestore: runtime.session.restore,
    getSceneTreeState: runtime.scene.getState,
    getDocumentViewModel: runtime.documents.getViewModel,
    subscribeDocuments: runtime.documents.subscribe,
    executeCommand: runtime.commands.execute,
    registerCommand: runtime.commands.register,
    unregisterCommand: runtime.commands.unregister,
    contextKey: runtime.context,
    registerWidget: runtime.workbench.registerWidget,
    unregisterWidget: runtime.workbench.unregisterWidget,
    openWidget: runtime.workbench.openWidget,
    setWorkspace: runtime.project.setPath,
    getWorkspace: runtime.project.getPath,
  };
}
