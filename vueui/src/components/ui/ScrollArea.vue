<script setup lang="ts">
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<{ class?: string }>(), {});
</script>

<template>
  <ScrollAreaRoot
    data-slot="scroll-area"
    :class="cn('relative overflow-hidden', props.class)"
  >
    <ScrollAreaViewport
      data-slot="scroll-area-viewport"
      class="size-full rounded-[inherit] focus-visible:outline-none"
    >
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      orientation="vertical"
      class="flex touch-none p-px transition-colors select-none h-full w-2.5 border-l border-l-transparent"
    >
      <ScrollAreaThumb class="bg-base-300 relative flex-1 rounded-full min-h-[10px]" />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>
