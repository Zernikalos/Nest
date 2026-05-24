<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';

const keepAliveInclude = computed(() => {
  return [
    'ProjectsPage',
    'EditorPage',
    'EditorFormView',
    'EditorCodeView',
    'EditorViewerView',
    'SettingsPage',
    'GeneralSettingsView',
    'AppearanceSettingsView',
    'EnvironmentSettingsView',
    'DevicesPage',
    'ExporterPage',
  ];
});
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-base-100">
    <Sidebar />
    <main class="island-main flex-1 overflow-auto min-w-0 bg-base-100">
      <RouterView v-slot="{ Component, route: r }">
        <KeepAlive :include="keepAliveInclude">
          <component :is="Component" :key="r.path" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
</style>
