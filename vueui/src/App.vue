<script setup lang="ts">
import { provide } from 'vue';
import { TooltipProvider } from 'radix-vue';
import IdeCoreProvider from './components/IdeCoreProvider.vue';
import ElectronProvider from './components/ElectronProvider.vue';
import AppBody from './components/AppBody.vue';
import AppShell from './components/shell/AppShell.vue';
import { createNoOpHostPort } from '@ide-core/browser';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';

const api = typeof window !== 'undefined' ? window.NativeZernikalos : undefined;

const hostPort: HostPort = createNoOpHostPort({
  showSaveProjectDialog: api?.showSaveProjectDialog
    ? (name: string) => api.showSaveProjectDialog!(name).then((r) => r ?? null)
    : undefined,
  showOpenProjectDialog: api?.showOpenProjectDialog
    ? () => api.showOpenProjectDialog!().then((r) => r ?? null)
    : undefined,
  sendMenuContext: api?.sendMenuContext,
  getPlatform: api?.getPlatform,
  minimizeWindow: api?.windowMinimize ? () => void api.windowMinimize!() : undefined,
  maximizeWindow: api?.windowMaximize ? () => void api.windowMaximize!() : undefined,
  closeWindow: api?.windowClose ? () => void api.windowClose!() : undefined,
  isWindowMaximized: api?.windowIsMaximized,
  onWindowMaximizedChanged: api?.handleWindowMaximizedChanged
    ? (callback) => {
        const sub = api.handleWindowMaximizedChanged!((_ev, maximized) =>
          callback(maximized)
        );
        return () => sub.off();
      }
    : undefined,
  menuLoadZko: api?.menuLoadZko ? () => api.menuLoadZko!() : undefined,
  menuImportFile: api?.menuImportFile
    ? (format) => api.menuImportFile!(format)
    : undefined,
});
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
