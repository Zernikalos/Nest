<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import { AppMenuBar } from './menu';
import WindowControls from './WindowControls.vue';
import { usePlatformShell } from '@/composables/usePlatformShell';

defineOptions({ name: 'AppTitleBar' });

const APP_TITLE = 'Zernikalos Nest';

const {
  showInRendererMenuBar,
  showWindowControlButtons,
  reservesTrafficLightSpace,
} = usePlatformShell();
</script>

<template>
  <header
    class="app-title-bar flex h-8 shrink-0 select-none items-stretch border-b border-base-300 bg-base-200 text-base-foreground"
    aria-label="Application title bar"
  >
    <div
      v-if="reservesTrafficLightSpace"
      class="app-title-bar-drag shrink-0"
      style="width: 78px"
      aria-hidden="true"
    />

    <div class="app-title-bar-no-drag relative z-20 flex shrink-0 items-center gap-0.5 px-2">
      <Logo :size="18" class="mr-1" />
      <AppMenuBar v-if="showInRendererMenuBar" />
    </div>

    <div
      class="app-title-bar-drag relative z-0 flex min-w-0 flex-1 items-center justify-center px-2"
    >
      <span class="pointer-events-none truncate text-xs font-medium">
        {{ APP_TITLE }}
      </span>
    </div>

    <WindowControls v-if="showWindowControlButtons" class="relative z-20" />
  </header>
</template>

<style scoped>
.app-title-bar-drag {
  -webkit-app-region: drag;
}

.app-title-bar-no-drag {
  -webkit-app-region: no-drag;
}
</style>
