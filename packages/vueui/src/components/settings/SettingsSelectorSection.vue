<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/Button.vue';
import { ChevronRight } from 'lucide-vue-next';
</script>

<template>
  <RouterLink :to="to" class="block" v-slot="{ isActive }">
    <Button
      :variant="isActive ? 'secondary' : 'ghost'"
      class="w-full justify-start h-auto p-2"
    >
      <div class="flex items-start gap-2 w-full">
        <span class="shrink-0">
          <slot name="icon" />
        </span>
        <div class="flex-1 text-left min-w-0 overflow-hidden">
          <div class="font-medium break-words">{{ name }}</div>
          <div class="text-xs text-muted-foreground break-words">{{ description }}</div>
        </div>
        <ChevronRight class="h-4 w-4 shrink-0 mt-0.5" />
      </div>
    </Button>
  </RouterLink>
</template>

<script lang="ts">
export default {
  name: 'SettingsSelectorSection',
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    to: { type: String, required: true },
  },
};
</script>
