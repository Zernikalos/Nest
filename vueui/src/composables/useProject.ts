import { ref, watch, computed, inject, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectUIStore } from '@/stores/projectUIStore';
import type { IInputAsset } from '@/types/project';
import { HOST_PORT_KEY, PREFERENCES_PORT_KEY, type HostPort } from '@/types/hostPort';
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import type { EditorRuntime } from '@ide-core';
import type { StoragePort } from '@ide-core';

export function useProject() {
  const router = useRouter();
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const preferencesPort = inject<StoragePort | undefined>(PREFERENCES_PORT_KEY);
  const runtime = inject<EditorRuntime | null>(RUNTIME_KEY, null);
  const projectUIStore = useProjectUIStore();

  const projectViewModel = ref(
    runtime ? runtime.project.getViewModel() : { projectFilePath: null, project: null, isLoading: false, error: null, isProjectOpen: false }
  );

  let unsubProject: (() => void) | null = null;
  onMounted(() => {
    if (runtime) {
      unsubProject = runtime.project.subscribe(() => {
        projectViewModel.value = runtime.project.getViewModel();
      });
      projectViewModel.value = runtime.project.getViewModel();
    }
  });
  onUnmounted(() => {
    unsubProject?.();
  });

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
    if (!runtime) throw new Error('Runtime not available');
    try {
      await runtime.project.create(name, filePath);
      syncMenuContext(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create project';
      projectUIStore.setCreationError(message);
      throw e;
    }
  }

  async function openProject(filePath: string): Promise<void> {
    if (!runtime) throw new Error('Runtime not available');
    await runtime.project.open(filePath);
    syncMenuContext(true);
    await preferencesPort?.set('lastProjectPath', filePath);
  }

  function closeProject(): void {
    runtime?.project.close();
    syncMenuContext(false);
  }

  async function addAssetToProject(
    asset: Omit<IInputAsset, 'id' | 'importedAt'>
  ): Promise<void> {
    if (!runtime) throw new Error('Runtime not available');
    await runtime.project.addAsset(asset);
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
