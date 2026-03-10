<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useElectronProjectIntegration } from '@/composables/useElectronProjectIntegration';

useElectronProjectIntegration();
</script>

<template>
  <RouterView />
</template>
