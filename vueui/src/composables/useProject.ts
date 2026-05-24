import { computed, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectUIStore } from '@/stores/projectUIStore';
import type { IInputAsset } from '@/types/project';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import { useSettingsStore } from '@/stores/settingsStore';

export function useProject() {
  const router = useRouter();
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const settingsStore = useSettingsStore();
  const projectUIStore = useProjectUIStore();
  const editor = useEditorStore();
  const projectViewModel = useEditorSlice('project');

  const projectFilePath = computed(() => projectViewModel.value.projectFilePath);
  const isProjectOpen = computed(() => projectViewModel.value.isProjectOpen);
  const projectMetadata = computed(() => projectViewModel.value.project);
  const isLoading = computed(() => projectViewModel.value.isLoading);
  const error = computed(() => projectViewModel.value.error);

  function syncMenuContext(projectOpen: boolean) {
    hostPort?.sendMenuContext?.({ projectOpen });
  }

  watch(
    () => projectViewModel.value.isProjectOpen,
    (projectOpen) => {
      syncMenuContext(projectOpen);
    },
    { immediate: true }
  );

  async function createProject(name: string, filePath: string): Promise<void> {
    try {
      await editor.createProject(name, filePath);
      syncMenuContext(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create project';
      projectUIStore.setCreationError(message);
      throw e;
    }
  }

  async function openProject(filePath: string): Promise<void> {
    await editor.openProject(filePath);
    syncMenuContext(true);
    await settingsStore.setLastProjectPath(filePath);
  }

  function closeProject(): void {
    editor.closeProject();
    syncMenuContext(false);
  }

  async function addAssetToProject(
    asset: Omit<IInputAsset, 'id' | 'importedAt'>
  ): Promise<void> {
    await editor.addAssetToProject(asset);
  }

  async function createProjectWithDialog(projectName: string): Promise<void> {
    projectUIStore.setCreating(true);
    projectUIStore.setCreationError(null);
    try {
      const filePath = await hostPort?.showSaveProjectDialog?.(projectName);
      if (!filePath) {
        projectUIStore.setCreating(false);
        return;
      }
      await createProject(projectName, filePath);
      projectUIStore.setIsCreateDialogOpen(false);
      router.push('/editor');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to create project';
      projectUIStore.setCreationError(message);
    } finally {
      projectUIStore.setCreating(false);
    }
  }

  return {
    projectFilePath,
    project: projectMetadata,
    projectMetadata,
    isLoading,
    error,
    isProjectOpen,
    createProject,
    createProjectWithDialog,
    openProject,
    closeProject,
    addAssetToProject,
  };
}
