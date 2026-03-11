<script setup lang="ts">
import { onMounted, inject } from 'vue';
import { RouterView } from 'vue-router';
import type { StoragePort } from '@zstudio/ide-core';
import { useElectronProjectIntegration } from '@/composables/useElectronProjectIntegration';
import { useSettingsStore } from '@/stores/settingsStore';
import { PREFERENCES_PORT_KEY } from '@/types/hostPort';

useElectronProjectIntegration();

onMounted(async () => {
  const port = inject<StoragePort | undefined>(PREFERENCES_PORT_KEY);
  if (port) {
    const store = useSettingsStore();
    store.setPreferencesPort(port);
    await store.hydrateFromPort();
  }
});
</script>

<template>
  <RouterView />
</template>
