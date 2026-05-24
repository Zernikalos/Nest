<script setup lang="ts">
import { ref, provide } from 'vue';
import { getActivePinia } from 'pinia';
import type { EditorRuntime } from '@ide-core';
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
import { provideEditorRuntime, installEditorStore } from '@ide-core/vue';
import { PREFERENCES_PORT_KEY } from '@/types/hostPort';

const runtimeRef = ref<EditorRuntime | null>(null);
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

const runtime = runtimeRef.value as EditorRuntime;
provideEditorRuntime(runtime);
const pinia = getActivePinia();
if (pinia) {
  installEditorStore(pinia, runtime);
}
if (preferencesPort) {
  provide(PREFERENCES_PORT_KEY, preferencesPort);
}
</script>

<template>
  <slot></slot>
</template>
