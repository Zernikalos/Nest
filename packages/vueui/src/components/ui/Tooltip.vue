<script setup lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{ class?: string; side?: 'top' | 'right' | 'bottom' | 'left' }>(),
  { side: 'top' }
);
</script>

<template>
  <TooltipRoot>
    <TooltipTrigger as-child data-slot="tooltip-trigger">
      <slot name="trigger" />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        :side="props.side"
        :side-offset="0"
        :class="
          cn(
            'bg-base-100 text-base-foreground border border-base-300 shadow-lg z-50 w-fit rounded-md px-3 py-1.5 text-xs',
            props.class
          )
        "
        data-slot="tooltip-content"
      >
        <slot />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
