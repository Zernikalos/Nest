<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useElectronProjectIntegration } from '@/composables/useElectronProjectIntegration';
import { useProject } from '@/composables/useProject';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { useWindowBackgroundSync } from '@/composables/useWindowBackgroundSync';

useElectronProjectIntegration();
useWindowBackgroundSync();

const router = useRouter();
const { openProject } = useProject();
const settingsStore = useSettingsStore();
const appearanceStore = useAppearanceStore();

onMounted(async () => {
  await settingsStore.hydrate();

  const { theme, font } = settingsStore.appearance;
  appearanceStore.setTheme(theme);
  appearanceStore.setFont(font);

  if (settingsStore.general.reopenProjectsOnStartup && settingsStore.lastProjectPath) {
    try {
      await openProject(settingsStore.lastProjectPath);
      await router.push('/editor');
    } catch {
      await settingsStore.setLastProjectPath(undefined);
    }
  }
});
</script>

<template>
  <RouterView />
</template>
