<script setup lang="ts">
import { provide } from 'vue';
import { TooltipProvider } from 'radix-vue';
import IdeCoreProvider from './components/IdeCoreProvider.vue';
import ElectronProvider from './components/ElectronProvider.vue';
import AppBody from './components/AppBody.vue';
import AppShell from './components/shell/AppShell.vue';
import { createElectronHostPort } from '@/adapters/createElectronHostPort';
import { HOST_PORT_KEY } from '@/types/hostPort';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';

const api = typeof window !== 'undefined' ? window.NativeZernikalos : undefined;
const hostPort = createElectronHostPort(api);

provide(HOST_PORT_KEY, hostPort);
/* Default so inject() never "not found" when editor views are cached by KeepAlive outside NestEditorProvider */
provide(NEST_EDITOR_KEY, undefined);
</script>

<template>
  <IdeCoreProvider>
    <ElectronProvider>
      <TooltipProvider>
        <AppShell>
          <AppBody />
        </AppShell>
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
