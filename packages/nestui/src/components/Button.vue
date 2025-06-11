<template>
  <button
    class="btn"
    :class="[
      btnSize,
      btnVariant,
      btnColor,
      {
        'glass': glass,
        'loading': loading,
        'w-full': fullWidth,
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <slot name="icon">
      <component 
        v-if="icon" 
        :is="icon" 
        class="h-4 w-4"
        :class="{ 'mr-2': $slots.default }"
      />
    </slot>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ButtonColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost';
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const props = withDefaults(defineProps<{
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  glass?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  fullWidth?: boolean;
}>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  glass: false,
  disabled: false,
  loading: false,
  icon: null,
  fullWidth: false,
});

const emit = defineEmits(['click']);

// --- DaisyUI classes computed from props ---
const btnSize = computed(() => ({
  'btn-md': props.size === 'md',
  'btn-xs': props.size === 'xs',
  'btn-sm': props.size === 'sm',
  'btn-lg': props.size === 'lg',
  // 'btn-md' is the default, no class needed
}));

const btnVariant = computed(() => ({
  'btn-solid': props.variant === 'solid',
  'btn-outline': props.variant === 'outline',
  'btn-ghost': props.variant === 'ghost',
  'btn-link': props.variant === 'link',
}));

const btnColor = computed(() => {
  // For solid buttons, the color class is all that's needed.
  // For other variants, DaisyUI combines classes, e.g., `btn-outline btn-primary`.
  return `btn-${props.color}`;
});

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
@reference "@nestui/assets/main.css";


</style>
