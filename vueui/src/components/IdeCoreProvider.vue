<script setup lang="ts">
import { provide, ref } from 'vue';
import { createEditorRuntime } from '@/runtime/createEditorRuntime';
import {
  createLocalStorageStoragePort,
  createElectronStoragePort,
  createPreferencesPort,
  isElectronStorageAvailable,
} from '@/runtime/storageAdapter';
import { createProjectPort } from '@/runtime/projectAdapter';
import { createAssetConversionPort } from '@/runtime/assetConversionAdapter';
import { createEngineSessionPort } from '@/runtime/engineSessionAdapter';
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import { PREFERENCES_PORT_KEY } from '@/types/hostPort';

const runtimeRef = ref<ReturnType<typeof createEditorRuntime> | null>(null);
let preferencesPort: ReturnType<typeof createPreferencesPort> | null = null;
if (!runtimeRef.value) {
  const storage = isElectronStorageAvailable()
    ? createElectronStoragePort()
    : createLocalStorageStoragePort();
  preferencesPort = createPreferencesPort(storage);
  const project = createProjectPort();
  const assetConversion = createAssetConversionPort();
  const engineSession = createEngineSessionPort();
  runtimeRef.value = createEditorRuntime({ storage, project, assetConversion, engineSession });
}
provide(RUNTIME_KEY, runtimeRef.value);
if (preferencesPort) {
  provide(PREFERENCES_PORT_KEY, preferencesPort);
}
</script>

<template>
  <slot></slot>
</template>
