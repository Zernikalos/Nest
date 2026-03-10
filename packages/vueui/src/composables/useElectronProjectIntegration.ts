import { onMounted, onUnmounted, watch } from 'vue';
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

/**
 * Composable that integrates Electron IPC events with project/editor commands.
 * Registers commands with the runtime and wires window events to executeCommand.
 * Call once inside IdeCoreProvider (e.g. from App or a root layout).
 */
export function useElectronProjectIntegration() {
  const router = useRouter();
  const electron = useElectronEvents();
  const { executeCommand, registerCommand, contextKey } = useIdeCore();
  const { openProject } = useProject();
  const projectUIStore = useProjectUIStore();
  const zkoStore = useZkoStore();
  const projectStore = useProjectStore();

  // Register command handlers
  onMounted(() => {
    registerCommand(FILE_LOAD_ZKO, () => {
      // Placeholder: no handler yet
    });

    registerCommand(FILE_IMPORT_FILE, (_payload?: unknown) => {
      // Placeholder: asset conversion will be wired in Phase 3 (Editor)
      zkoStore.setError('Asset conversion only available in Electron environment');
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
          window.NativeZernikalos?.sendMenuContext?.({ projectOpen: true });
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
    if (!electron.isElectron) return;
    electron.offLoadZko();
    electron.offImportFile();
    electron.offBundleScene();
    electron.offCreateProject();
    electron.offOpenProject();
  });

  // Keep contextKey and menu context in sync with project store
  watch(
    () => projectStore.projectFilePath != null,
    (projectOpen) => {
      contextKey?.set?.('projectOpen', projectOpen);
      if (electron.isElectron) {
        window.NativeZernikalos?.sendMenuContext?.({ projectOpen });
      }
    },
    { immediate: true }
  );
}
