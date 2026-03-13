<script setup lang="ts">
import { computed } from 'vue';
import Label from '@/components/ui/Label.vue';
import Input from '@/components/ui/Input.vue';

const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    disabled?: boolean;
    class?: string;
  }>(),
  { readOnly: false, disabled: false }
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const inputClass = computed(() => {
  const muted = props.disabled || props.readOnly ? 'bg-muted' : '';
  const base = 'transition-all duration-200 font-mono text-sm';
  const custom = props.class ?? '';
  return [muted, base, custom].filter(Boolean).join(' ');
});

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target?.value ?? '');
}
</script>

<template>
  <div class="space-y-3">
    <Label
      :for="id"
      class="text-sm font-medium text-base-foreground/90 flex items-center gap-2"
    >
      <slot name="icon">
        <div class="w-2 h-2 rounded-full bg-primary/60" />
      </slot>
      {{ label }}
    </Label>
    <div class="relative">
      <Input
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :readonly="readOnly"
        :disabled="disabled"
        :class="inputClass"
        @input="onInput($event)"
      />
      <div
        v-if="readOnly"
        class="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <div class="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
      </div>
    </div>
  </div>
</template>
