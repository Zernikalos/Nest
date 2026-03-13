<script setup lang="ts">
import EditorFormSection from './EditorFormSection.vue';
import InputEditorItem from './InputEditorItem.vue';

/**
 * Minimal shape for the selected object in the editor (from tree).
 * Avoids depending on @zernikalos/zernikalos in vueui.
 */
export interface ZObjectFormShape {
  refId: string;
  name: string;
  type: { name: string } | string;
  transform: {
    position: { x: number; y: number; z: number };
    rotation: { w: number; x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
}

defineProps<{
  zObject: ZObjectFormShape;
  notifyChange: () => void;
}>();

function typeDisplayName(t: ZObjectFormShape['type']): string {
  if (typeof t === 'string') return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  return t.name.charAt(0).toUpperCase() + t.name.slice(1).toLowerCase();
}

function updateName(zObject: ZObjectFormShape, value: string, notify: () => void) {
  (zObject as unknown as Record<string, unknown>).name = value;
  notify();
}
</script>

<template>
  <EditorFormSection title="ZObject Properties" badge="3D Object">
    <template #icon>
      <div class="w-4 h-4 rounded border border-current opacity-80" />
    </template>
    <InputEditorItem
      id="refId"
      label="Reference ID"
      :model-value="zObject.refId"
      read-only
      disabled
    />
    <InputEditorItem
      id="type"
      label="Type"
      :model-value="typeDisplayName(zObject.type)"
      read-only
      disabled
    />
    <InputEditorItem
      id="name"
      label="Name"
      :model-value="zObject.name"
      placeholder="Enter object name"
      @update:model-value="(v) => updateName(zObject, v, notifyChange)"
    />
  </EditorFormSection>
</template>
