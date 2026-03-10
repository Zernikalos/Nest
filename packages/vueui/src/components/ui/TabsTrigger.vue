<script setup lang="ts">
import { TabsTrigger } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string; value: string }>();
</script>

<template>
  <TabsTrigger
    v-bind="$attrs"
    :value="props.value"
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-base-100 data-[state=active]:text-base-foreground data-[state=active]:shadow',
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
