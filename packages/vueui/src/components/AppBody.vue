<script setup lang="ts">
import { onMounted, inject } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import type { StoragePort } from '@zstudio/ide-core';
import { useElectronProjectIntegration } from '@/composables/useElectronProjectIntegration';
import { useProject } from '@/composables/useProject';
import { useSettingsStore } from '@/stores/settingsStore';
import { PREFERENCES_PORT_KEY } from '@/types/hostPort';

useElectronProjectIntegration();

const router = useRouter();
const { openProject } = useProject();
const settingsStore = useSettingsStore();

onMounted(async () => {
  const port = inject<StoragePort | undefined>(PREFERENCES_PORT_KEY);
  if (port) {
    settingsStore.setPreferencesPort(port);
    await settingsStore.hydrateFromPort();
  }

  if (settingsStore.general.reopenProjectsOnStartup && port) {
    const lastPath = await port.get('lastProjectPath');
    if (lastPath) {
      try {
        await openProject(lastPath);
        await router.push('/editor');
      } catch {
        await port.delete('lastProjectPath');
      }
    }
  }
});
</script>

<template>
  <RouterView />
</template>
