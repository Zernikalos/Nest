<script setup lang="ts">
import { Separator } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{ class?: string; orientation?: 'horizontal' | 'vertical'; decorative?: boolean }>(),
  { orientation: 'horizontal', decorative: true }
);
</script>

<template>
  <Separator
    data-slot="separator"
    :decorative="props.decorative"
    :orientation="props.orientation"
    :class="
      cn(
        'shrink-0 bg-base-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        props.class
      )
    "
  />
</template>
