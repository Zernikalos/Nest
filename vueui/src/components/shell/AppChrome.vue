<script setup lang="ts">
import { usePlatformShell } from '@/composables/usePlatformShell';
import AppTitleBar from './AppTitleBar.vue';

defineOptions({ name: 'AppChrome' });

const { showCustomChrome } = usePlatformShell();
</script>

<template>
  <AppTitleBar v-if="showCustomChrome" />
</template>
