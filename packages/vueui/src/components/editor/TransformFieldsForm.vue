<script setup lang="ts">
import EditorFormSection from './EditorFormSection.vue';
import MathInputEditorItem from './MathInputEditorItem.vue';
import type { ZObjectFormShape } from './CommonFieldsForm.vue';

defineProps<{
  zObject: ZObjectFormShape;
  notifyChange: () => void;
}>();

function updateTransform(
  target: Record<string, number>,
  value: Record<string, number>,
  notify: () => void
) {
  Object.assign(target, value);
  notify();
}
</script>

<template>
  <EditorFormSection title="Transform" orientation="rows" badge="3D Transform">
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm font-medium text-base-foreground/80 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="text-muted-foreground"
          >
            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
          </svg>
          Position
        </div>
        <MathInputEditorItem
          id="position"
          type="vec3"
          name-prefix="transform.position"
          :model-value="zObject.transform.position"
          orientation="rows"
          @update:model-value="(v) => updateTransform(zObject.transform.position, v, notifyChange)"
        />
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm font-medium text-base-foreground/80 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="text-muted-foreground"
          >
            <path d="M21 12a9 9 0 11-9-9" />
            <path d="M21 3v9" />
            <path d="M21 12a9 9 0 01-9 9" />
          </svg>
          Rotation
        </div>
        <MathInputEditorItem
          id="rotation"
          type="quat"
          name-prefix="transform.rotation"
          :model-value="zObject.transform.rotation"
          orientation="rows"
          @update:model-value="(v) => updateTransform(zObject.transform.rotation, v, notifyChange)"
        />
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm font-medium text-base-foreground/80 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="text-muted-foreground"
          >
            <path d="M21 21H3V3" />
            <path d="M21 9V3h-6" />
            <path d="M9 21h6" />
          </svg>
          Scale
        </div>
        <MathInputEditorItem
          id="scale"
          type="vec3"
          name-prefix="transform.scale"
          :model-value="zObject.transform.scale"
          orientation="rows"
          @update:model-value="(v) => updateTransform(zObject.transform.scale, v, notifyChange)"
        />
      </div>
    </div>
  </EditorFormSection>
</template>
