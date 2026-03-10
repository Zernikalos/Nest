import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/projectStore';
import { useProjectUIStore } from '@/stores/projectUIStore';
import * as projectApi from '@/lib/projectApi';
import type { Project } from '@/types/project';
import type { IInputAsset } from '@/types/project';

export function useProject() {
  const router = useRouter();
  const projectStore = useProjectStore();
  const projectUIStore = useProjectUIStore();

  const project = ref<Project | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  watch(
    () => projectStore.projectFilePath,
    async (filePath) => {
      if (!filePath) {
        project.value = null;
        error.value = null;
        return;
      }
      isLoading.value = true;
      error.value = null;
      try {
        project.value = await projectApi.getProjectByPath(filePath);
      } catch (e) {
        error.value = e instanceof Error ? e : new Error('Failed to load project');
        project.value = null;
      } finally {
        isLoading.value = false;
      }
    },
    { immediate: true }
  );

  const projectFilePath = computed(() => projectStore.projectFilePath);
  const isProjectOpen = computed(() => projectFilePath.value !== null);
  const projectMetadata = computed(() => project.value ?? null);

  async function createProject(name: string, filePath: string): Promise<void> {
    try {
      const created = await projectApi.createProject(name, filePath);
      projectStore.setProjectPath(filePath);
      project.value = created;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create project';
      projectUIStore.setCreationError(message);
      throw e;
    }
  }

  async function openProject(filePath: string): Promise<void> {
    try {
      const p = await projectApi.getProjectByPath(filePath);
      projectStore.setProjectPath(filePath);
      project.value = p;
    } catch (e) {
      throw e;
    }
  }

  function closeProject(): void {
    projectStore.clearProjectPath();
    project.value = null;
    error.value = null;
  }

  async function addAssetToProject(
    asset: Omit<IInputAsset, 'id' | 'importedAt'>
  ): Promise<void> {
    const path = projectStore.projectFilePath;
    if (!path) throw new Error('No project is currently open');
    const updated = await projectApi.addInputAsset(path, asset);
    project.value = updated;
  }

  async function createProjectWithDialog(projectName: string): Promise<void> {
    projectUIStore.setCreating(true);
    projectUIStore.setCreationError(null);
    try {
      const filePath = await window.NativeZernikalos?.showSaveProjectDialog?.(
        projectName
      );
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
