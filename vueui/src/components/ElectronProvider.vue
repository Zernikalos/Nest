<script setup lang="ts">
import { provide, ref, onUnmounted } from 'vue';
import type { ElectronSubscription } from '@/types/electron';

const isElectron =
  typeof window !== 'undefined' && window.NativeZernikalos !== undefined;

const subscriptions = new Map<string, ElectronSubscription>();

function off(name: string) {
  const sub = subscriptions.get(name);
  sub?.off();
  subscriptions.delete(name);
}

function onLoadZko(cb: (data: unknown) => void) {
  // Deprecated: kept for compatibility during transition.
  if (!isElectron) return;
}

function onImportFile(cb: (data: unknown) => void) {
  // Deprecated: kept for compatibility during transition.
  if (!isElectron) return;
}

function onBundleScene(cb: () => void) {
  // Deprecated: kept for compatibility during transition.
  if (!isElectron) return;
}

function onCreateProject(cb: () => void) {
  // Deprecated: kept for compatibility during transition.
  if (!isElectron) return;
}

function onOpenProject(cb: (data: { filePath: string }) => void) {
  // Deprecated: kept for compatibility during transition.
  if (!isElectron) return;
}

function onExecuteCommand(cb: (data: { commandId: string; payload?: unknown }) => void) {
  if (!isElectron || subscriptions.has('executeCommand')) return;
  const sub = window.NativeZernikalos?.onExecuteCommand?.((_ev, data) => cb(data));
  if (sub) subscriptions.set('executeCommand', sub);
}

const api = ref({
  isElectron,
  onExecuteCommand,
  onLoadZko,
  onImportFile,
  onBundleScene,
  onCreateProject,
  onOpenProject,
  offExecuteCommand: () => off('executeCommand'),
  offLoadZko: () => off('loadZko'),
  offImportFile: () => off('importFile'),
  offBundleScene: () => off('bundleScene'),
  offCreateProject: () => off('createProject'),
  offOpenProject: () => off('openProject'),
});

provide('electron', api);

onUnmounted(() => {
  off('loadZko');
  off('importFile');
  off('bundleScene');
  off('createProject');
  off('openProject');
});
</script>

<template>
  <slot />
</template>
