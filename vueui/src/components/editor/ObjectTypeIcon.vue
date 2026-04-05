<script setup lang="ts">
import { computed } from 'vue';
import {
  Box,
  Camera,
  LayoutPanelTop,
  Lightbulb,
  Layers,
  Bone,
} from '@lucide/vue';
import type { ZObjectType } from './objectTypeIcon';

const props = withDefaults(
  defineProps<{ type: ZObjectType | string; size?: number }>(),
  { size: 16 }
);

const iconComponent = computed(() => {
  const typeStr = typeof props.type === 'string' ? props.type : '';
  const map: Record<string, typeof Box> = {
    SCENE: Layers,
    MODEL: Box,
    GROUP: LayoutPanelTop,
    CAMERA: Camera,
    SKELETON: Bone,
    LIGHT: Lightbulb,
  };
  return map[typeStr] ?? Box;
});
</script>

<template>
  <component
    :is="iconComponent"
    :size="size"
    class="object-type-icon text-muted-foreground flex-shrink-0"
    aria-hidden
  />
</template>

<style scoped>
.object-type-icon {
  color: var(--muted-foreground);
}
</style>
