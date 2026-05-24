<script setup lang="ts">
import { ref, provide } from 'vue';
import { getActivePinia } from 'pinia';
import type { EditorRuntime } from '@ide-core';
import { createEditorRuntime } from '@/runtime/createEditorRuntime';
import {
  createLocalStorageStoragePort,
  createElectronStoragePort,
  isElectronStorageAvailable,
} from '@/runtime/storageAdapter';
import { createProjectPort } from '@/runtime/projectAdapter';
import { createAssetConversionPort } from '@/runtime/assetConversionAdapter';
import { createEngineSessionPort } from '@/runtime/engineSessionAdapter';
import { provideEditorRuntime, installEditorStore } from '@ide-core/vue';

const runtimeRef = ref<EditorRuntime | null>(null);
if (!runtimeRef.value) {
  const storage = isElectronStorageAvailable()
    ? createElectronStoragePort()
    : createLocalStorageStoragePort();
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
</script>

<template>
  <slot></slot>
</template>
