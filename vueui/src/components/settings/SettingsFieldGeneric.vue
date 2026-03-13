<script setup lang="ts">
import SettingsFieldBase from './SettingsFieldBase.vue';
</script>

<template>
  <SettingsFieldBase
    :title="title"
    :description="description"
    :layout="layout ?? 'horizontal'"
  >
    <slot />
  </SettingsFieldBase>
</template>

<script lang="ts">
export default {
  name: 'SettingsFieldGeneric',
  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    layout: { type: String as () => 'horizontal' | 'vertical', default: 'horizontal' },
  },
};
</script>
