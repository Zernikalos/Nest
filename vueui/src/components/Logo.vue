<script setup lang="ts">
defineOptions({ name: 'Logo', inheritAttrs: false });

withDefaults(
  defineProps<{
    size?: number;
  }>(),
  { size: 20 }
);
</script>

<template>
  <img
    v-bind="$attrs"
    src="/zklogo.svg"
    alt="Zernikalos"
    class="select-none shrink-0"
    :width="size"
    :height="size"
  />
</template>
