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
  if (!isElectron || subscriptions.has('loadZko')) return;
  const sub = window.NativeZernikalos?.handleLoadZko?.((_ev, data) => cb(data));
  if (sub) subscriptions.set('loadZko', sub);
}

function onImportFile(cb: (data: unknown) => void) {
  if (!isElectron || subscriptions.has('importFile')) return;
  const sub = window.NativeZernikalos?.handleShowImport?.((_ev, data) => cb(data));
  if (sub) subscriptions.set('importFile', sub);
}

function onBundleScene(cb: () => void) {
  if (!isElectron || subscriptions.has('bundleScene')) return;
  const sub = window.NativeZernikalos?.handleBundleScene?.(() => cb());
  if (sub) subscriptions.set('bundleScene', sub);
}

function onCreateProject(cb: () => void) {
  if (!isElectron || subscriptions.has('createProject')) return;
  const sub = window.NativeZernikalos?.handleCreateProject?.(() => cb());
  if (sub) subscriptions.set('createProject', sub);
}

function onOpenProject(cb: (data: { filePath: string }) => void) {
  if (!isElectron || subscriptions.has('openProject')) return;
  const sub = window.NativeZernikalos?.handleOpenProject?.((_ev, data: { filePath: string }) => cb(data));
  if (sub) subscriptions.set('openProject', sub);
}

const api = ref({
  isElectron,
  onLoadZko,
  onImportFile,
  onBundleScene,
  onCreateProject,
  onOpenProject,
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
