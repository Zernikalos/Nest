<script setup lang="ts">
import { provide, ref } from 'vue';
import { createEditorRuntime } from '@/runtime/createEditorRuntime';
import { createLocalStorageStoragePort } from '@/runtime/storageAdapter';
import { RUNTIME_KEY } from '@/composables/useIdeCore';

const runtimeRef = ref<ReturnType<typeof createEditorRuntime> | null>(null);
if (!runtimeRef.value) {
  runtimeRef.value = createEditorRuntime({
    storage: createLocalStorageStoragePort(),
  });
}
provide(RUNTIME_KEY, runtimeRef.value);
</script>

<template>
  <slot></slot>
</template>
