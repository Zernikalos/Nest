<script setup lang="ts">
import Label from '@/components/ui/Label.vue';
</script>

<template>
  <div
    v-if="layout === 'horizontal'"
    class="flex items-center justify-between"
  >
    <div class="space-y-0.5">
      <Label class="text-base">{{ title }}</Label>
      <p class="text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot />
  </div>
  <div v-else class="space-y-4">
    <div class="space-y-2">
      <Label class="text-base">{{ title }}</Label>
      <p class="text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SettingsFieldBase',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    layout: { type: String as () => 'horizontal' | 'vertical', default: 'horizontal' },
  },
};
</script>
