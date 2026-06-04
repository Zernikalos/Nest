import { onMounted, onUnmounted, watch, nextTick, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useElectronEvents } from '@/composables/useElectronEvents';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import { useProject } from '@/composables/useProject';
import { useProjectUIStore } from '@/stores/projectUIStore';
import { CommandId, AssetFormat } from '@/lib/commandIds';
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
        editor.registerCommand(CommandId.FILE_LOAD_ZKO, (payload?: unknown) => {
            const data = payload as AssetConversionData | undefined;
            if (data?.path && data?.fileName) {
                return;
            }
            void hostPort?.menuLoadZko?.().then((picked) => {
                if (!picked) return;
                // Handler body for load ZKO remains a placeholder until implemented
                console.info('[loadZko] picked file', picked);
            });
        });

        editor.registerCommand(CommandId.FILE_IMPORT_FILE, (payload?: unknown) => {
            if (!project.value.isProjectOpen) {
                editor.setProjectPersistWarning('Open or create a project before importing.');
                return;
            }

            const runImport = (data: AssetConversionData) => {
                void editor
                    .convertAsset(data)
                    .then(async () => {
                        await nextTick();
                        await router.push('/editor/viewer');
                    })
                    .catch(() => {
                        // Error is already in runtime asset conversion view model
                    });
            };

            const data = (payload || {}) as AssetConversionData;
            if (data.path && data.fileName) {
                runImport(data);
                return;
            }

            const format = data.format as AssetFormat | undefined;
            if (!format) return;
            void hostPort?.menuImportFile?.(format).then((picked) => {
                if (!picked) return;
                runImport({
                    path: picked.path,
                    fileName: picked.fileName,
                    format: picked.format,
                });
            });
        });

        editor.registerCommand(CommandId.FILE_BUNDLE_SCENE, () => {
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

        editor.registerCommand(CommandId.FILE_CREATE_PROJECT, () => {
            projectUIStore.setIsCreateDialogOpen(true);
        });

        editor.registerCommand(CommandId.FILE_OPEN_PROJECT, (payload?: unknown) => {
            const fromPayload = (payload as { filePath?: string } | undefined)?.filePath;
            if (fromPayload) {
                void openProject(fromPayload)
                    .then(() => router.push('/projects'))
                    .catch((err) => console.error('Failed to open project:', err));
                return;
            }
            void hostPort?.showOpenProjectDialog?.().then((filePath) => {
                if (!filePath) return;
                void openProject(filePath)
                    .then(() => router.push('/projects'))
                    .catch((err) => console.error('Failed to open project:', err));
            });
        });

        if (!electron.isElectron) return;

        electron.onExecuteCommand(({ commandId, payload }) => {
            editor.executeCommand(commandId, payload);
        });
    });

    onUnmounted(() => {
        editor.unregisterCommand(CommandId.FILE_LOAD_ZKO);
        editor.unregisterCommand(CommandId.FILE_IMPORT_FILE);
        editor.unregisterCommand(CommandId.FILE_BUNDLE_SCENE);
        editor.unregisterCommand(CommandId.FILE_CREATE_PROJECT);
        editor.unregisterCommand(CommandId.FILE_OPEN_PROJECT);
        if (!electron.isElectron) return;
        electron.offExecuteCommand();
    });
}
