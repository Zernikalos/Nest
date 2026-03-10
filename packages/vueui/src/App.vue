<script setup lang="ts">
import { TooltipProvider } from 'radix-vue';
import IdeCoreProvider from './components/IdeCoreProvider.vue';
import ElectronProvider from './components/ElectronProvider.vue';
import AppBody from './components/AppBody.vue';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { onMounted } from 'vue';

const appearance = useAppearanceStore();
const settings = useSettingsStore();

onMounted(() => {
  const { theme, font } = settings.getAppearanceSettings;
  appearance.setTheme(theme);
  appearance.setFont(font);
});
</script>

<template>
  <IdeCoreProvider>
    <ElectronProvider>
      <TooltipProvider>
        <AppBody />
      </TooltipProvider>
    </ElectronProvider>
  </IdeCoreProvider>
</template>

<style>
:root {
  --app-font: system-ui, sans-serif;
}
html {
  font-family: var(--app-font);
}
</style>
