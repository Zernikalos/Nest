import { onMounted, onUnmounted, watch, nextTick, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useElectronEvents } from '@/composables/useElectronEvents';
import { useIdeCore } from '@/composables/useIdeCore';
import { useProject } from '@/composables/useProject';
import { useProjectUIStore } from '@/stores/projectUIStore';
import { useZkoStore } from '@/stores/zkoStore';
import { useProjectStore } from '@/stores/projectStore';
import {
  FILE_LOAD_ZKO,
  FILE_IMPORT_FILE,
  FILE_BUNDLE_SCENE,
  FILE_CREATE_PROJECT,
  FILE_OPEN_PROJECT,
} from '@/lib/commandIds';
import type { AssetConversionData } from '@/types/project';
import { useAssetToZko } from '@/composables/useAssetToZko';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';

/**
 * Composable that integrates Electron IPC events with project/editor commands.
 * Registers commands with the runtime and wires window events to executeCommand.
 * Call once inside IdeCoreProvider (e.g. from App or a root layout).
 */
export function useElectronProjectIntegration() {
  const router = useRouter();
  const hostPort = inject<HostPort>(HOST_PORT_KEY);
  const electron = useElectronEvents();
  const { executeCommand, registerCommand, unregisterCommand, contextKey } = useIdeCore();
  const { openProject } = useProject();
  const { convertAssetToZko } = useAssetToZko();
  const projectUIStore = useProjectUIStore();
  const zkoStore = useZkoStore();
  const projectStore = useProjectStore();

  // Register command handlers
  onMounted(() => {
    registerCommand(FILE_LOAD_ZKO, () => {
      // Placeholder: no handler yet
    });

    registerCommand(FILE_IMPORT_FILE, (payload?: unknown) => {
      const data = (payload || {}) as AssetConversionData;
      if (!data.path || !data.fileName || !data.format) {
        zkoStore.setError('Invalid import data: path, fileName and format are required.');
        return;
      }
      convertAssetToZko(data)
        .then(async () => {
          await nextTick();
          await router.push('/editor/viewer');
        })
        .catch(() => {
          zkoStore.setError('Asset conversion failed. Please try again.');
        });
    });

    registerCommand(FILE_BUNDLE_SCENE, () => {
      // Placeholder: bundle scene will be wired when useBundleScene exists
      zkoStore.setError('Failed to bundle scene. Please try again.');
    });

    registerCommand(FILE_CREATE_PROJECT, () => {
      projectUIStore.setIsCreateDialogOpen(true);
    });

    registerCommand(FILE_OPEN_PROJECT, (payload?: unknown) => {
      const { filePath } = (payload || {}) as { filePath: string };
      if (!filePath) return;
      openProject(filePath)
        .then(() => {
          contextKey?.set?.('projectOpen', true);
          hostPort?.sendMenuContext?.({ projectOpen: true });
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

  // Keep contextKey and menu context in sync with project store.
  watch(
    () => projectStore.projectFilePath != null,
    (projectOpen) => {
      contextKey?.set?.('projectOpen', projectOpen);
      hostPort?.sendMenuContext?.({ projectOpen });
    },
    { immediate: true }
  );
}
