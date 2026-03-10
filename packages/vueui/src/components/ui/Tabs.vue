<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string }>();
</script>

<template>
  <TabsRoot v-bind="$attrs" :class="cn('w-full', props.class)">
    <slot name="list" />
    <slot />
  </TabsRoot>
</template>
