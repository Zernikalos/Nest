import { onMounted, onUnmounted, watch, nextTick, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useElectronEvents } from '@/composables/useElectronEvents';
import { useIdeCore } from '@/composables/useIdeCore';
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
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import type { EditorRuntime } from '@ide-core';

/**
 * Composable that integrates Electron IPC events with project/editor commands.
 * Registers commands with the runtime and wires window events to executeCommand.
 * Call once inside IdeCoreProvider (e.g. from App or a root layout).
 */
export function useElectronProjectIntegration() {
  const router = useRouter();
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const runtime = inject<EditorRuntime | null>(RUNTIME_KEY, null);
  const electron = useElectronEvents();
  const { executeCommand, registerCommand, unregisterCommand, contextKey } = useIdeCore();
  const { openProject } = useProject();
  const projectUIStore = useProjectUIStore();

  const projectOpenRef = ref(false);
  let unsubProject: (() => void) | null = null;
  onMounted(() => {
    if (runtime) {
      unsubProject = runtime.subscribeProject(() => {
        projectOpenRef.value = runtime.getProjectViewModel().isProjectOpen;
      });
      projectOpenRef.value = runtime.getProjectViewModel().isProjectOpen;
    }
  });
  onUnmounted(() => {
    unsubProject?.();
  });

  watch(
    projectOpenRef,
    (projectOpen) => {
      contextKey?.set?.('projectOpen', projectOpen);
      hostPort?.sendMenuContext?.({ projectOpen });
    },
    { immediate: true }
  );

  // Register command handlers
  onMounted(() => {
    registerCommand(FILE_LOAD_ZKO, () => {
      // Placeholder: no handler yet
    });

    registerCommand(FILE_IMPORT_FILE, (payload?: unknown) => {
      const data = (payload || {}) as AssetConversionData;
      if (!data.path || !data.fileName || !data.format || !runtime) return;
      void runtime.convertAsset(data).then(async () => {
        await nextTick();
        await router.push('/editor/viewer');
      }).catch(() => {
        // Error is already in runtime asset conversion view model
      });
    });

    registerCommand(FILE_BUNDLE_SCENE, () => {
      // Placeholder: bundle scene will be wired when useBundleScene exists
    });

    registerCommand(FILE_CREATE_PROJECT, () => {
      projectUIStore.setIsCreateDialogOpen(true);
    });

    registerCommand(FILE_OPEN_PROJECT, (payload?: unknown) => {
      const { filePath } = (payload || {}) as { filePath: string };
      if (!filePath) return;
      openProject(filePath)
        .then(() => {
          router.push('/projects');
        })
        .catch((err) => console.error('Failed to open project:', err));
    });
  });

  // Wire IPC events to commands when in Electron
  onMounted(() => {
    if (!electron.isElectron) return;

    electron.onLoadZko((data) => executeCommand(FILE_LOAD_ZKO, data));
    electron.onImportFile((data) => executeCommand(FILE_IMPORT_FILE, data));
    electron.onBundleScene(() => executeCommand(FILE_BUNDLE_SCENE));
    electron.onCreateProject(() => executeCommand(FILE_CREATE_PROJECT));
    electron.onOpenProject((data) => executeCommand(FILE_OPEN_PROJECT, data));
  });

  onUnmounted(() => {
    unregisterCommand?.(FILE_LOAD_ZKO);
    unregisterCommand?.(FILE_IMPORT_FILE);
    unregisterCommand?.(FILE_BUNDLE_SCENE);
    unregisterCommand?.(FILE_CREATE_PROJECT);
    unregisterCommand?.(FILE_OPEN_PROJECT);
    if (!electron.isElectron) return;
    electron.offLoadZko();
    electron.offImportFile();
    electron.offBundleScene();
    electron.offCreateProject();
    electron.offOpenProject();
  });
}
