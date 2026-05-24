<script setup lang="ts">
import AppChrome from './AppChrome.vue';

defineOptions({ name: 'AppShell' });
</script>

<template>
  <div class="flex h-screen min-h-0 flex-col overflow-hidden bg-base-100">
    <AppChrome />
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <slot />
    </div>
  </div>
</template>
