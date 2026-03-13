<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Tooltip from '@/components/ui/Tooltip.vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{ path: string; name: string; selected?: boolean }>(),
  { selected: false }
);

function getTo(path: string) {
  return path;
}
</script>

<template>
  <div
    :class="cn(
      'border-l-4 border-l-transparent',
      props.selected && 'border-l-primary'
    )"
  >
    <Tooltip side="right">
      <template #trigger>
        <RouterLink
          :to="getTo(props.path)"
          :class="cn(
            'flex items-center justify-center py-4 px-2 h-12 overflow-hidden text-ellipsis whitespace-nowrap text-base-foreground/80',
            'hover:bg-base-300 hover:text-base-foreground transition duration-300 ease-in-out',
            props.selected && 'bg-base-300 text-base-foreground'
          )"
        >
          <slot name="icon">
            <span class="text-lg font-semibold">{{ name.charAt(0) }}</span>
          </slot>
        </RouterLink>
      </template>
      <template #default>
        <p>{{ props.name }}</p>
      </template>
    </Tooltip>
  </div>
</template>
