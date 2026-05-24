<script setup lang="ts">
import { provide } from 'vue';
import { TooltipProvider } from 'radix-vue';
import IdeCoreProvider from './components/IdeCoreProvider.vue';
import ElectronProvider from './components/ElectronProvider.vue';
import AppBody from './components/AppBody.vue';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';

const api = typeof window !== 'undefined' ? window.NativeZernikalos : undefined;
const hostPort: HostPort = {
  showSaveProjectDialog: api?.showSaveProjectDialog
    ? (name: string) => api.showSaveProjectDialog!(name).then((r) => r ?? null)
    : async () => null,
  showOpenProjectDialog: api?.showOpenProjectDialog
    ? () => api.showOpenProjectDialog!().then((r) => r ?? null)
    : async () => null,
  sendMenuContext: api?.sendMenuContext ?? (() => {}),
};
provide(HOST_PORT_KEY, hostPort);
/* Default so inject() never "not found" when editor views are cached by KeepAlive outside NestEditorProvider */
provide(NEST_EDITOR_KEY, undefined);

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
