import { onMounted, onUnmounted, watch, nextTick, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useElectronEvents } from '@/composables/useElectronEvents';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import { useProject } from '@/composables/useProject';
import { useProjectUIStore } from '@/stores/projectUIStore';
import {
  FILE_LOAD_ZKO,
  FILE_IMPORT_FILE,
  FILE_BUNDLE_SCENE,
  FILE_CREATE_PROJECT,
  FILE_OPEN_PROJECT,
} from '@/lib/commandIds';
import type { AssetConversionData } from '@/types/project';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';

/**
 * Composable that integrates Electron IPC events with project/editor commands.
 */
export function useElectronProjectIntegration() {
  const router = useRouter();
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const electron = useElectronEvents();
  const editor = useEditorStore();
  const project = useEditorSlice('project');
  const assets = useEditorSlice('assets');
  const { openProject } = useProject();
  const projectUIStore = useProjectUIStore();

  const projectOpen = computed(() => project.value.isProjectOpen);

  watch(
    projectOpen,
    (open) => {
      editor.setContextKey('projectOpen', open);
      hostPort?.sendMenuContext?.({ projectOpen: open });
    },
    { immediate: true }
  );

  onMounted(() => {
    editor.registerCommand(FILE_LOAD_ZKO, () => {
      // Placeholder: no handler yet
    });

    editor.registerCommand(FILE_IMPORT_FILE, (payload?: unknown) => {
      if (!project.value.isProjectOpen) {
        editor.setProjectPersistWarning('Open or create a project before importing.');
        return;
      }
      const data = (payload || {}) as AssetConversionData;
      if (!data.path || !data.fileName || !data.format) return;
      void editor
        .convertAsset(data)
        .then(async () => {
          await nextTick();
          await router.push('/editor/viewer');
        })
        .catch(() => {
          // Error is already in runtime asset conversion view model
        });
    });

    editor.registerCommand(FILE_BUNDLE_SCENE, () => {
      if (!electron.isElectron) return;

      const proto = assets.value.lastResult?.proto;
      if (!proto) {
        editor.setProjectPersistWarning(
          'No scene available to bundle. Import an asset first.'
        );
        return;
      }

      const saveFile = window.NativeZernikalos?.actionSaveFile;
      if (!saveFile) {
        console.warn('[bundleScene] NativeZernikalos.actionSaveFile not available');
        editor.setProjectPersistWarning(
          'Bundle scene is not available in this environment.'
        );
        return;
      }

      void saveFile(proto).catch((err) => {
        console.error('Failed to save bundle scene', err);
        editor.setProjectPersistWarning('Failed to save bundle scene.');
      });
    });

    editor.registerCommand(FILE_CREATE_PROJECT, () => {
      projectUIStore.setIsCreateDialogOpen(true);
    });

    editor.registerCommand(FILE_OPEN_PROJECT, (payload?: unknown) => {
      const { filePath } = (payload || {}) as { filePath: string };
      if (!filePath) return;
      openProject(filePath)
        .then(() => {
          router.push('/projects');
        })
        .catch((err) => console.error('Failed to open project:', err));
    });
  });

  onMounted(() => {
    if (!electron.isElectron) return;

    electron.onLoadZko((data) => editor.executeCommand(FILE_LOAD_ZKO, data));
    electron.onImportFile((data) => editor.executeCommand(FILE_IMPORT_FILE, data));
    electron.onBundleScene(() => editor.executeCommand(FILE_BUNDLE_SCENE));
    electron.onCreateProject(() => editor.executeCommand(FILE_CREATE_PROJECT));
    electron.onOpenProject((data) => editor.executeCommand(FILE_OPEN_PROJECT, data));
  });

  onUnmounted(() => {
    editor.unregisterCommand(FILE_LOAD_ZKO);
    editor.unregisterCommand(FILE_IMPORT_FILE);
    editor.unregisterCommand(FILE_BUNDLE_SCENE);
    editor.unregisterCommand(FILE_CREATE_PROJECT);
    editor.unregisterCommand(FILE_OPEN_PROJECT);
    if (!electron.isElectron) return;
    electron.offLoadZko();
    electron.offImportFile();
    electron.offBundleScene();
    electron.offCreateProject();
    electron.offOpenProject();
  });
}
