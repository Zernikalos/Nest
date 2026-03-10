<script setup lang="ts">
import Label from '@/components/ui/Label.vue';
import Input from '@/components/ui/Input.vue';
import { computed } from 'vue';

export type MathType = 'vec2' | 'vec3' | 'vec4' | 'quat' | 'euler' | 'rgba';

const props = withDefaults(
  defineProps<{
    id: string;
    label?: string;
    type: MathType;
    namePrefix: string;
    modelValue: Record<string, number>;
    readOnly?: boolean;
    disabled?: boolean;
    class?: string;
    orientation?: 'columns' | 'rows';
  }>(),
  { readOnly: false, disabled: false, orientation: 'columns' }
);

const emit = defineEmits<{ 'update:modelValue': [value: Record<string, number>] }>();

const componentLabels: Record<MathType, string[]> = {
  vec2: ['X', 'Y'],
  vec3: ['X', 'Y', 'Z'],
  vec4: ['X', 'Y', 'Z', 'W'],
  quat: ['W', 'X', 'Y', 'Z'],
  euler: ['X', 'Y', 'Z'],
  rgba: ['R', 'G', 'B', 'A'],
};

const componentKeys: Record<MathType, string[]> = {
  vec2: ['x', 'y'],
  vec3: ['x', 'y', 'z'],
  vec4: ['x', 'y', 'z', 'w'],
  quat: ['w', 'x', 'y', 'z'],
  euler: ['x', 'y', 'z'],
  rgba: ['r', 'g', 'b', 'a'],
};

const labels = componentLabels[props.type];
const keys = componentKeys[props.type];

function updateKey(key: string, value: number) {
  const next = { ...props.modelValue, [key]: value };
  emit('update:modelValue', next);
}

function onInput(key: string, e: Event) {
  const target = (e.target as HTMLInputElement);
  const num = Number(target?.value);
  if (!Number.isNaN(num)) updateKey(key, num);
}

const inputClass = computed(() => {
  const base =
    'text-center rounded-l-none px-3 py-2 text-sm font-mono transition-all duration-200 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';
  const muted = props.disabled || props.readOnly ? 'bg-base-200' : '';
  const custom = props.class ?? '';
  return [muted, base, custom].filter(Boolean).join(' ');
});
</script>

<template>
  <div :class="orientation === 'rows' ? 'space-y-1' : 'space-y-3'">
    <Label
      v-if="label"
      :for="id"
      class="text-sm font-medium text-base-foreground/90 flex items-center gap-2"
    >
      <div class="w-2 h-2 rounded-full bg-primary/60" />
      {{ label }}
    </Label>
    <div
      :class="
        orientation === 'columns' ? 'flex gap-3' : 'flex flex-col gap-2'
      "
    >
      <div
        v-for="(key, index) in keys"
        :key="key"
        :class="orientation === 'columns' ? 'flex-1 min-w-0' : 'w-full'"
      >
        <div class="flex items-stretch w-full group">
          <span
            class="px-2 py-2 bg-base-300 text-base-foreground border border-base-300 rounded-l-md text-xs font-semibold select-none flex items-center justify-center w-8 transition-all duration-200"
          >
            {{ labels[index] }}
          </span>
          <Input
            :id="`${id}-${key}`"
            type="number"
            step="any"
            :value="modelValue[key]"
            :readonly="readOnly"
            :disabled="disabled"
            :class="inputClass"
            @input="onInput(key, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
