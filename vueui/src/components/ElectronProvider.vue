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

function onExecuteCommand(cb: (data: { commandId: string; payload?: unknown }) => void) {
  if (!isElectron || subscriptions.has('executeCommand')) return;
  const sub = window.NativeZernikalos?.onExecuteCommand?.((_ev, data) => cb(data));
  if (sub) subscriptions.set('executeCommand', sub);
}

const api = ref({
  isElectron,
  onExecuteCommand,
  offExecuteCommand: () => off('executeCommand'),
});

provide('electron', api);

onUnmounted(() => {
  off('executeCommand');
});
</script>

<template>
  <slot />
</template>
