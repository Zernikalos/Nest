<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { Minus, Square, X, SquareStack } from '@lucide/vue';
import { HOST_PORT_KEY, type HostPort } from '@/types/hostPort';
import { cn } from '@/lib/utils';

defineOptions({ name: 'WindowControls' });

const hostPort = inject<HostPort>(HOST_PORT_KEY);
const isMaximized = ref(false);

let unsubscribeMaximized: (() => void) | undefined;

onMounted(async () => {
  if (hostPort?.isWindowMaximized) {
    isMaximized.value = await hostPort.isWindowMaximized();
  }
  if (hostPort?.onWindowMaximizedChanged) {
    unsubscribeMaximized = hostPort.onWindowMaximizedChanged((maximized) => {
      isMaximized.value = maximized;
    });
  }
});

onUnmounted(() => {
  unsubscribeMaximized?.();
});

function onMinimize() {
  hostPort?.minimizeWindow?.();
}

function onMaximize() {
  hostPort?.maximizeWindow?.();
}

function onClose() {
  hostPort?.closeWindow?.();
}
</script>

<template>
  <div class="window-controls app-title-bar-no-drag flex shrink-0 items-stretch">
    <button
      type="button"
      class="window-controls-btn flex h-8 w-11 items-center justify-center hover:bg-base-300"
      aria-label="Minimize"
      @click="onMinimize"
    >
      <Minus class="h-3.5 w-3.5" />
    </button>
    <button
      type="button"
      class="window-controls-btn flex h-8 w-11 items-center justify-center hover:bg-base-300"
      :aria-label="isMaximized ? 'Restore' : 'Maximize'"
      @click="onMaximize"
    >
      <Square v-if="!isMaximized" class="h-3 w-3" />
      <SquareStack v-else class="h-3 w-3" />
    </button>
    <button
      type="button"
      :class="
        cn(
          'window-controls-btn flex h-8 w-11 items-center justify-center hover:bg-error hover:text-error-foreground'
        )
      "
      aria-label="Close"
      @click="onClose"
    >
      <X class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<style scoped>
.window-controls-btn {
  -webkit-app-region: no-drag;
}
</style>
