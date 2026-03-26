<script setup lang="ts">
import { useNestEditor } from '@/composables/useNestEditor';
import CommonFieldsForm from './CommonFieldsForm.vue';
import TransformFieldsForm from './TransformFieldsForm.vue';
import type { ZObjectFormShape } from './CommonFieldsForm.vue';

const props = defineProps<{ zObject: ZObjectFormShape }>();

const editor = useNestEditor();
const notifyChange = editor?.notifyChange ?? (() => {});
</script>

<template>
  <div class="space-y-6 p-1">
    <div class="space-y-1">
      <h3
        class="text-lg font-semibold text-base-foreground/90 flex items-center gap-2"
      >
        <div
          class="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"
        />
        Object Inspector
      </h3>
      <p class="text-sm text-muted-foreground">
        Edit 3D object properties and transformations
      </p>
    </div>
    <div class="space-y-4">
      <CommonFieldsForm :z-object="zObject" :notify-change="notifyChange" />
      <TransformFieldsForm :z-object="zObject" :notify-change="notifyChange" />
    </div>
  </div>
</template>
