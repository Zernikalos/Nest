<script setup lang="ts">
import { TabsContent } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string; value: string }>();
</script>

<template>
  <TabsContent
    v-bind="$attrs"
    :value="props.value"
    :class="cn('mt-2 ring-offset-background focus-visible:outline-none', props.class)"
  >
    <slot />
  </TabsContent>
</template>
