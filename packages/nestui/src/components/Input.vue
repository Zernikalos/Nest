<template>
  <label class="form-control w-full">
    <div v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <input
      v-model="data"
      :type="type"
      :placeholder="placeholder"
      class="input w-full"
      :class="[inputSize, inputColor, inputBorder]"
      :disabled="disabled"
    />
    <div v-if="helperText || (error && errorMessage)" class="label">
      <span class="label-text-alt" :class="{ 'text-error': error }">{{ error && errorMessage ? errorMessage : helperText }}</span>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useVModel } from "@vueuse/core";

type InputSize = 'xs' | 'sm' | 'md' | 'lg';
type InputColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';

const props = withDefaults(defineProps<{
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  size?: InputSize;
  color?: InputColor;
  bordered?: boolean;
  helperText?: string;
  error?: boolean; // To indicate an error state, often driven by validation
  errorMessage?: string; // Message to show when error is true
}>(), {
  label: "",
  placeholder: "",
  disabled: false,
  type: 'text',
  size: 'md',
  bordered: true,
  helperText: "",
  error: false,
  errorMessage: "",
});

const emit = defineEmits(["update:modelValue"]);
const data = useVModel(props, "modelValue", emit);

const inputSize = computed(() => {
  if (props.size === 'md') return ''; // md is usually default
  return `input-${props.size}`;
});

const inputColor = computed(() => {
  if (props.error) return 'input-error'; // Error prop takes precedence
  if (props.color) return `input-${props.color}`;
  return '';
});

const inputBorder = computed(() => {
  return props.bordered ? 'input-bordered' : '';
});

</script>

<style scoped>
@reference "@nestui/assets/main.css";

.input-xs {
    @apply input-xs;
}
.input-sm {
    @apply input-sm;
}
.input-md {
    @apply input-md;
}
.input-lg {
    @apply input-lg;
}

</style>