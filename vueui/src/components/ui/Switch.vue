<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: string;
  checked?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:checked': [value: boolean];
}>();

function handleCheckedChange(value: boolean) {
  emit('update:checked', value);
}
</script>

<template>
  <SwitchRoot
    data-slot="switch"
    :checked="props.checked"
    :disabled="props.disabled"
    @update:checked="handleCheckedChange"
    :class="
      cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-base-300 focus-visible:border-primary focus-visible:ring-primary/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="
        cn(
          'bg-base-100 block size-4 rounded-full ring-0 transition-transform pointer-events-none data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-base-foreground data-[state=checked]:bg-primary-foreground'
        )
      "
    />
  </SwitchRoot>
</template>
